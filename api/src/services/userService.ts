import { prisma } from "../db/prisma";

export const upsertUser = async (payload: {
  googleId: string;
  email: string;
  displayName: string;
  accessToken: string;
  refreshToken: string;
  profilePictureURL?: string;
}) => {
  const { googleId, email, displayName, accessToken, refreshToken, profilePictureURL } = payload;
  const user = await prisma.user.upsert({
    where: { google_id: googleId },
    update: {
      email,
      display_name: displayName,
      access_token: accessToken,
      refresh_token: refreshToken,
      profile_picture: profilePictureURL,
    },
    create: {
      google_id: googleId,
      email,
      display_name: displayName,
      access_token: accessToken,
      refresh_token: refreshToken,
      profile_picture: profilePictureURL,
      access_token_expires_at: new Date(Date.now() + 3600 * 1000), // 1 hour expiry
    },
  });
  return user;
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

export const getUserByGoogleId = async (googleId: string) => {
  return prisma.user.findUnique({ where: { google_id: googleId } });
};
