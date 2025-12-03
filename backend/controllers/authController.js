import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import passport from 'passport';
import { sendOTPEmail } from '../utils/emailService.js';
import { generateOTP, generateOTPExpiry, validateOTP } from '../utils/otpUtils.js';

// In-memory store for pending registrations (email -> registration data)
const pendingRegistrations = new Map();

// Cleanup expired pending registrations every 5 minutes
setInterval(() => {
  const now = new Date();
  for (const [email, data] of pendingRegistrations.entries()) {
    if (now > new Date(data.otpExpiry)) {
      pendingRegistrations.delete(email);
      console.log(`🧹 Cleaned up expired pending registration for: ${email}`);
    }
  }
}, 5 * 60 * 1000); // 5 minutes

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate email format (only .com, .in, .org allowed)
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|in|org)$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address (.com, .in, or .org)' });
    }

    // Check if user already exists in database
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if there's already a pending registration for this email
    if (pendingRegistrations.has(email)) {
      // Update the pending registration with new OTP
      const otp = generateOTP();
      const otpExpiry = generateOTPExpiry();

      const existingData = pendingRegistrations.get(email);
      pendingRegistrations.set(email, {
        ...existingData,
        name,
        password,
        role,
        otp,
        otpExpiry,
        createdAt: new Date()
      });

      // Send new OTP email
      try {
        await sendOTPEmail(email, name, otp);
        return res.status(200).json({
          email: email,
          message: 'A new OTP has been sent to your email. Please check your inbox to verify your account.'
        });
      } catch (emailError) {
        return res.status(500).json({
          message: 'Failed to send verification email. Please try again.'
        });
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = generateOTPExpiry();

    // Store registration data in memory (not in database yet)
    pendingRegistrations.set(email, {
      name,
      email,
      password,
      role,
      otp,
      otpExpiry,
      createdAt: new Date()
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, name, otp);

      res.status(201).json({
        email: email,
        message: 'Registration initiated! Please check your email for the OTP to verify your account.'
      });
    } catch (emailError) {
      // If email fails, remove the pending registration
      pendingRegistrations.delete(email);
      return res.status(500).json({
        message: 'Failed to send verification email. Please try again.'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
      // Check if email is verified
      if (!user.isEmailVerified) {
        return res.status(403).json({
          message: 'Please verify your email before logging in. Check your inbox for the OTP.',
          emailVerified: false,
          email: user.email
        });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio || user.bio;
      user.skills = req.body.skills || user.skills;
      user.hourlyRate = req.body.hourlyRate || user.hourlyRate;
      user.avatar = req.body.avatar || user.avatar;

      if (req.body.portfolio) {
        user.portfolio = req.body.portfolio;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        hourlyRate: updatedUser.hourlyRate,
        avatar: updatedUser.avatar,
        portfolio: updatedUser.portfolio
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Please provide email and OTP' });
    }

    // First check if this is a pending registration
    const pendingData = pendingRegistrations.get(email);

    if (pendingData) {
      // Validate OTP from pending registration
      const validation = validateOTP(pendingData.otp, otp, pendingData.otpExpiry);

      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      // OTP is valid - now create the user in database
      try {
        const user = await User.create({
          name: pendingData.name,
          email: pendingData.email,
          password: pendingData.password,
          role: pendingData.role,
          isEmailVerified: true
        });

        // Remove from pending registrations
        pendingRegistrations.delete(email);
        console.log(`✅ User registered and verified: ${email}`);

        // Return user data with token for auto-login
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: true,
          token: generateToken(user._id),
          message: 'Email verified successfully! You are now logged in.'
        });
      } catch (dbError) {
        return res.status(500).json({
          message: 'Failed to create user account. Please try again.'
        });
      }
    } else {
      // Fallback: Check if user already exists in database (for old flow compatibility)
      const user = await User.findOne({ email }).select('+emailOTP +emailOTPExpires');

      if (!user) {
        return res.status(404).json({ message: 'No registration found for this email. Please register first.' });
      }

      // Check if already verified
      if (user.isEmailVerified) {
        return res.status(400).json({ message: 'Email is already verified' });
      }

      // Validate OTP
      const validation = validateOTP(user.emailOTP, otp, user.emailOTPExpires);

      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      // Mark email as verified and clear OTP
      user.isEmailVerified = true;
      user.emailOTP = undefined;
      user.emailOTPExpires = undefined;
      await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: true,
        token: generateToken(user._id),
        message: 'Email verified successfully! You can now log in.'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }

    // First check if this is a pending registration
    const pendingData = pendingRegistrations.get(email);

    if (pendingData) {
      // Generate new OTP for pending registration
      const otp = generateOTP();
      const otpExpiry = generateOTPExpiry();

      // Update pending registration with new OTP
      pendingRegistrations.set(email, {
        ...pendingData,
        otp,
        otpExpiry
      });

      // Send OTP email
      try {
        await sendOTPEmail(email, pendingData.name, otp);
        console.log(`📧 Resent OTP to pending registration: ${email}`);
        return res.json({ message: 'OTP has been resent to your email' });
      } catch (emailError) {
        return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
      }
    }

    // Fallback: Check if user exists in database (for old flow compatibility)
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No registration found for this email. Please register first.' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = generateOTPExpiry();

    // Update user with new OTP
    user.emailOTP = otp;
    user.emailOTPExpires = otpExpiry;
    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, user.name, otp);
      res.json({ message: 'OTP has been resent to your email' });
    } catch (emailError) {
      res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check verification status
// @route   GET /api/auth/verification-status/:email
// @access  Public
export const checkVerificationStatus = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      email: user.email,
      isEmailVerified: user.isEmailVerified
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
export const googleCallback = async (req, res) => {
  try {
    console.log('📍 Google callback handler reached');

    if (!req.user) {
      console.error('❌ No user found in request');
      return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }

    console.log('✅ User authenticated:', {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name
    });

    const token = generateToken(req.user._id);
    console.log('🎫 JWT token generated');

    // Redirect to frontend with token
    const redirectUrl = `${process.env.CLIENT_URL}/auth/google/success?token=${token}`;
    console.log('🔄 Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('❌ Google callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=callback_failed`);
  }
};
