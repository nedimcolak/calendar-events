import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./env";
import { getUserByGoogleId, upsertUser } from "../services/userService";
import { syncCalendarEvents } from "../services/googleCalendarService";
import { syncUserEvents } from "../services/eventService";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.google.clientId || "",
      clientSecret: env.google.clientSecret || "",
      callbackURL: env.google.redirectUri || "",
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await getUserByGoogleId(profile.id);
      if (user) {
        try {
          const googleEvents = await syncCalendarEvents({ ...user, access_token: accessToken, refresh_token: refreshToken });
          await syncUserEvents(user.id, googleEvents);
        } catch (error) {
          console.error("Error syncing events on login:", error);
        }
        return done(null, { ...user, access_token: accessToken, refresh_token: refreshToken });
      }
      const newUser = await upsertUser({
        googleId: profile.id,
        email: profile.emails ? profile.emails[0].value : "",
        displayName: profile.displayName,
        accessToken,
        refreshToken,
        profilePictureURL: profile.photos ? profile.photos[0].value : "",
      });
      try {
        const googleEvents = await syncCalendarEvents({ ...newUser, access_token: accessToken, refresh_token: refreshToken });
        await syncUserEvents(newUser.id, googleEvents);
      } catch (error) {
        console.error("Error syncing events on login:", error);
      }
      return done(null, { ...newUser, access_token: accessToken, refresh_token: refreshToken });
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id: any, done) => {
  done(null, id);
});

export default passport;
