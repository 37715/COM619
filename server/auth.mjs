import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route"; 
async function requireSession(req) {
    const session = await getServerSession({ req, authOptions });

    if (!session) {
        throw new Error("Unauthorized");
    }

    return session;
}
export default requireSession;