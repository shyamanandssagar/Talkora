import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.model.js";
import { upsertStreamUser } from "./stream.js";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const fullName = profile.displayName;
        const profilePic = profile.photos[0]?.value || `https://api.dicebear.com/9.x/avataaars/svg?seed=${fullName}`;

        // Check if user already exists by googleId or email
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        if (user) {
          // Link Google ID if not already linked
          if (!user.googleId) {
            user.googleId = profile.id;
            user.isEmailVerified = true;
            await user.save();
          }
        } else {
          // Create new user
          user = await User.create({
            googleId: profile.id,
            fullName,
            email,
            profilePic,
            isEmailVerified: true,
            // No password for Google users
          });

          await upsertStreamUser({
            id: user._id.toString(),
            name: user.fullName,
            image: user.profilePic || undefined,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

//  use JWT not sessions, so these are minimal stubs
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;
