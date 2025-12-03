# Email Verification - Environment Configuration

## Required Environment Variables

Add the following variables to your `backend/.env` file:

```env
# Email Configuration for OTP Verification
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM="Worksera <your-email@gmail.com>"
```

## Gmail Setup Instructions

### Option 1: Using Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Google Account:
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other (Custom name)" → Enter "Worksera"
   - Click "Generate"
   - Copy the 16-character password
   - Use this as `EMAIL_PASSWORD` in your `.env` file

3. **Update `.env` file**:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # App password from step 2
   EMAIL_FROM="Worksera <your-gmail@gmail.com>"
   ```

### Option 2: Using Outlook

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-outlook-password
EMAIL_FROM="Worksera <your-email@outlook.com>"
```

### Option 3: Using Mailtrap (For Testing Only)

Mailtrap is perfect for testing without sending real emails:

1. Sign up at: https://mailtrap.io
2. Get SMTP credentials from your inbox
3. Update `.env`:
   ```env
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USER=your-mailtrap-username
   EMAIL_PASSWORD=your-mailtrap-password
   EMAIL_FROM="Worksera <test@worksera.com>"
   ```

## Testing the Configuration

After setting up the environment variables:

1. Restart your backend server
2. Register a new user with a valid email
3. Check your email inbox (or Mailtrap inbox) for the OTP
4. Verify the email using the 6-digit OTP

## Troubleshooting

### "Failed to send verification email"
- Check if EMAIL_USER and EMAIL_PASSWORD are correct
- Ensure 2FA is enabled and you're using an App Password (for Gmail)
- Check if EMAIL_HOST and EMAIL_PORT are correct
- Verify backend server logs for detailed error messages

### Gmail "Less secure app access" error
- Gmail no longer supports "Less secure apps"
- You MUST use App Passwords (requires 2FA to be enabled)

### Emails going to spam
- This is common with Gmail SMTP
- Check spam folder during testing
- For production, use dedicated email services like SendGrid or AWS SES
