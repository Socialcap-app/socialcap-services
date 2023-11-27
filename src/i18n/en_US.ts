import { i } from "./helpers.js";

const en_US: any = {
    // 
    is_language: i('English US'),
    tagline: i('Your community credentials'),
    all_rights_reserved: i('@2023 - SocialCap - All rights reserved'),
    
    // errors
    database_error: i("Failed database action: {}"),
    missing_param: i("Missing '{}' param in '{}'"),
    unknown_error: i("Unknown error in '{}': {}"),
    method_not_supported: i("Method '{}' is not supported in API"),
  
    // sessions
    session_no_email_must_signup: i("No user with email='{}'. Must sign up !"),
    session_key_not_found: i("No available session. Must request new OTP."),
    session_invalid_otp: i("Can not authorize with this invalid OTP."),
    session_person_not_found: i("No person found with email='{}'."),
    session_person_not_active: i("The person with email='{}' is not currently active."),

    // persons
    persons_already_registered: i("The person with email='{}' is already registered. Goto to login !"),

}

export { 
  en_US 
};
