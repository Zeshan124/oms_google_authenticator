import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account && profile) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        token.googleId = account.providerAccountId;
        token.picture = profile.picture;
        token.verified_email = profile.verified_email;
        token.locale = profile.locale;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      session.user.id = token.sub;
      session.user.provider = token.provider;
      session.user.googleId = token.googleId;
      session.user.verified_email = token.verified_email;
      session.user.locale = token.locale;
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      console.log(`✅ User ${user.email} signed in with ${account.provider}`);
    },
    async signOut({ session, token }) {
      console.log(`👋 User signed out`);
    },
  },
});

export { handler as GET, handler as POST };
