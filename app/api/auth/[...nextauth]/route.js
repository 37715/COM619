import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/server/connectDB.mjs";
import User from "@/server/models/User.mjs";


export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

      
        const user = await User.findOne({ username: credentials.username });
        if (!user) {
          throw new Error("Username not found, please check your details and try again");
          
        }else{

         
          const isValid = user.password === credentials.password;

          if (!isValid) {
            throw new Error("Invalid Password, please check your details and try again.");
          }
        }
        
        return { name: user.username};
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if(token){
        const user = await User.findOne({username: token.name});
        if(user){
          session.user.name = user.username;
        }
      }
      return session;
      
    },
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

