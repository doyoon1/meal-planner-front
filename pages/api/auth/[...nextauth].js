import { mongooseConnect } from "@/lib/mongoose";
import mongoose from "mongoose";
import { UserAccounts } from "@/models/User";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcrypt";

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    CredentialsProvider({
        name: "Credentials",
        id: 'credentials',
        credentials: {
          username: { label: "Email", type: "email", placeholder: "test@example.com" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          const email = credentials?.email;
          const password = credentials?.password;

          mongoose.connect(process.env.MONGODB_URI);
          const user = await UserAccounts.findOne({email});
          const passwordOk = user && bcrypt.compareSync(password, user.password);

          if (passwordOk) {
            return user;
          }
          return null
        }
      }),
  ],
}

export default NextAuth(authOptions)