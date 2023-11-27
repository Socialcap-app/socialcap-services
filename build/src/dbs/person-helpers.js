import { PersonPartialSchema } from "../../prisma/generated/zod/index.js";
import { prisma } from "../global.js";
import { raiseError } from "../responses.js";
export async function getPersonOrRaise(uid) {
    const p = await prisma.person.findUnique({
        where: { uid: uid }
    });
    if (!p)
        raiseError.NotFound(`Person %{uid} not found`);
    return p;
}
export async function updatePersonOrRaise(uid, unsafeParams) {
    let params = PersonPartialSchema.safeParse(unsafeParams);
    if (!params.success)
        raiseError.BadRequest(params.error);
    const p = await prisma.person.update({
        where: { uid: uid },
        data: params.data,
    });
    if (!p)
        raiseError.DatabaseEngine(`Update person ${uid} failed`);
    return p;
}
//# sourceMappingURL=person-helpers.js.map