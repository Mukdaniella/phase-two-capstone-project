// lib/auth.ts (or app/api/auth/... if you're using the new format)

callbacks: {
  async jwt({ token, user }) {
    // When user first logs in (user exists only on sign-in)
    if (user) {
      token.id = user.id as string
      token.name = user.name
      token.email = user.email
      token.avatar = user.avatar || null
      token.bio = user.bio || null
      // If your backend also returns the access token, save it too:
      // token.accessToken = (user as any).accessToken
    }
    return token
  },

  async session({ session, token }) {
    if (token.id) {
      session.user.id = token.id as string
      session.user.avatar = token.avatar as string | null
      session.user.bio = token.bio as string | null
      // session.user.accessToken = token.accessToken as string
    }
    return session
  },
},