import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('🔐 Google OAuth callback triggered');
          console.log('Profile data:', {
            id: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName
          });

          const email = profile.emails[0].value;
          
          // Check if user already exists by email
          let user = await User.findOne({ email });

          if (user) {
            console.log('✅ Existing user found:', user._id);
            // Update Google ID if not set
            if (!user.googleId) {
              console.log('📝 Updating user with Google ID');
              user.googleId = profile.id;
              await user.save();
            }
            return done(null, user);
          }

          // Check if user exists by Google ID
          user = await User.findOne({ googleId: profile.id });
          if (user) {
            console.log('✅ User found by Google ID:', user._id);
            return done(null, user);
          }

          console.log('🆕 Creating new user from Google profile');
          
          // Create new user
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: email,
            avatar: profile.photos[0]?.value,
            role: 'freelancer', // Default role, can be changed later
            isEmailVerified: true, // Google emails are verified
          });

          console.log('✅ New user created successfully:', user._id);
          done(null, user);
        } catch (error) {
          console.error('❌ Google OAuth error:', error);
          console.error('Error details:', {
            message: error.message,
            code: error.code,
            errors: error.errors
          });
          done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
