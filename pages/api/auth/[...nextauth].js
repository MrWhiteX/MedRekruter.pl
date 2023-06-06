import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import authorizeUser from 'services/users/authorize';

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Credentials',

      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const user = await authorizeUser({
          email: credentials.email,
          password: credentials.password
        });

        if (user) {
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.name = user?.fullName;
        token.role = user?.role;
        token.id = user?.id;
      }

      return token;
    },

    async session(session, token) {
      session.user.role = token?.role;
      session.user.id = token?.id;

      return session;
    }
  }
});
