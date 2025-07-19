import { NextAuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { dbConnect } from "@/lib/db";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Thiếu email hoặc mật khẩu");
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("Email không tồn tại");

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) throw new Error("Sai mật khẩu");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    })
  ],
  pages: {
    signIn: "/authscreen/login",
  },
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
    async jwt({ token, user }) {
      // Khi login lần đầu, gắn id vào token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Gắn id từ token vào session.user
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
  
};
