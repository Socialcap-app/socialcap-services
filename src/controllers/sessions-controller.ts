import { randomInt, randomUUID } from "crypto";
import { fastify, prisma } from "../global.js";
import { i18n as _ } from "../i18n/messages.js";
import { hasResult, hasError } from "../responses.js";
import { OTPTemplate } from "../resources/email-templates.js";
import { sendEmail } from "../services/email-service.js";


/**
 * requestOTP
 * @param params Object: { email }
 * @returns MutationResult
 */
export async function requestOtp(params: object) {
  const remail: string = (params as any).email;

  // If no email => Error BAD_REQUEST (incomplete params)
  if (!remail)
    return hasError.MissingParams(_.missing_param("email", "requestOTP"));

  //If received email NOT exists in table personas => Error NOT_FOUND (does not exists)
  const hasPerson = await prisma.person.findUnique({
    where: { email: remail },
  });
  if (!hasPerson)
    return hasError.NotFound(_.session_no_email_must_signup(remail));

  // Generate OTP with random int up to 6 digits,
  // and left pad it with a random digit if less than 6 digits
  // ej: original otp= "126", filler= "4" = > otp= "444126"
  let otp = randomInt(999999).toString();
  const filler = randomInt(9).toString();
  otp = otp.padStart(6, filler);

  // Create the sessionKey using a random UUID but without the dashes
  const sessionKey = randomUUID().replace(/-/g, "");

  console.log(
    `request_otp email=${remail} otp=${otp} sessionKey=${sessionKey}`
  );

  // If email exists in table sessions => remove it
  const removed = await prisma.session.deleteMany({
    where: { email: remail },
  });

  // Now => insert into sessions(email,key,otp)
  const hasSession = await prisma.session.create({
    data: { email: remail, otp: otp, uid: sessionKey },
  });
  if (!hasSession)
    return hasError.DatabaseEngine(_.database_error("insert into table Session"));

  //Send email with otp to user
  console.log(
    `request_otp email=${remail} otp=${otp} sessionKey=${sessionKey}`
  );
  await sendEmail({
    email: remail,
    subject: "Your Socialcap verification code",
    text: "This is your login verification code: "+otp,
    html: OTPTemplate(hasPerson.fullName, remail, otp),
  });

  return hasResult({
    session_key: sessionKey,
  });
}

/**
 * login
 * @param params Object: { session_key, otp }
 * @returns MutationResult
 */
export async function login(params: { session_key: string; otp: string }) {
  const sessionKey = params.session_key;
  const otp = params.otp;

  // 1. If no `session_key` or `otp` => Error BAD_REQUEST (incomplete params)
  if (!sessionKey || !otp)
    return hasError.MissingParams(_.missing_param("session_key, OTP", "login"));

  // 2. If received `session_key` NOT matchs existent in `session` table => Error BAD_REQUEST
  const session = await prisma.session.findUnique({
    where: { uid: sessionKey },
  });
  if (!session) return hasError.NotFound(_.session_key_not_found());

  // 3. If received `otp` NOT matchs existent in `session` table => Error UNAUTHORIZED (bad OTP)
  if (otp.toString() !== session.otp.toString())
    return hasError.UnauthorizedError(_.session_invalid_otp());

  // 4. Get `email` from `sessions where session_key`
  // 5. Find one from `persons where email` => `person`
  const person = await prisma.person.findUnique({
    where: { email: session.email },
  });
  if (!person)
    return hasError.UnauthorizedError(_.session_person_not_found(session.email));

  // 6. Check person status just in case has been suspended, etc
  if (person.state === "INACTIVE")
    return hasError.UnauthorizedError(_.session_person_not_active(session.email));

  // 7. Generate the `authorization` JWT using the `persona uid` and extras
  const jwt = fastify.jwt.sign({
    uid: person.uid,
    session_key: sessionKey,
    created_utc: new Date(),
    expires_utc: null, // no expiration for now ...
  });
  console.log("JWT signed=", jwt, new Date());

  return hasResult({
    authorization: jwt,
    profile: person
  });
}
