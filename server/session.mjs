import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
 

async function getSessionFromRequest(req) {
  return await getServerSession({ req, authOptions });
}

export default getSessionFromRequest;