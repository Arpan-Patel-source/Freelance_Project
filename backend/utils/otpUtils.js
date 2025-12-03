// Generate a random 6-digit OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create OTP expiration time (10 minutes from now)
export const generateOTPExpiry = () => {
    return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};

// Validate OTP
export const validateOTP = (storedOTP, providedOTP, expiryTime) => {
    // Check if OTP exists
    if (!storedOTP) {
        return { valid: false, message: 'No OTP found. Please request a new one.' };
    }

    // Check if OTP has expired
    if (new Date() > new Date(expiryTime)) {
        return { valid: false, message: 'OTP has expired. Please request a new one.' };
    }

    // Check if OTP matches
    if (storedOTP !== providedOTP) {
        return { valid: false, message: 'Invalid OTP. Please try again.' };
    }

    return { valid: true, message: 'OTP verified successfully.' };
};

export default {
    generateOTP,
    generateOTPExpiry,
    validateOTP
};
