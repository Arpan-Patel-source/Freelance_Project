import express from 'express';
import passport from 'passport';
import { register, login, getMe, updateProfile, googleCallback, verifyEmail, resendOTP, checkVerificationStatus } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Email verification routes
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOTP);
router.get('/verification-status/:email', checkVerificationStatus);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: false
  }),
  googleCallback
);

export default router;

