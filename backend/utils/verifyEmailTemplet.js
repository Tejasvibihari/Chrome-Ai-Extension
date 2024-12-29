export default function emailVerificationTemplate(verificationLink, firstName) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Email Verification</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #CC72F2; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">Verify Your Email</h1>
          </div>
          <div style="padding: 20px; color: #333333;">
            <p style="font-size: 16px; line-height: 1.5;">
              Hi ${firstName}, 
              <br><br>
              Thank you for signing up. Please verify your email address to activate your account. Click the button below or copy and paste the link into your browser to verify your email:
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${verificationLink}" style="display: inline-block; background-color: #CC72F2; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px;">
                Verify Email
              </a>
            </div>
            <p style="font-size: 16px; line-height: 1.5; text-align: center;">
              Or copy and paste this link into your browser:
            </p>
            <p style="font-size: 14px; color: #555555; word-wrap: break-word; text-align: center; border: 1px solid #dddddd; padding: 10px; border-radius: 5px; background-color: #f9f9f9;">
              ${verificationLink}
            </p>
            <p style="font-size: 16px; line-height: 1.5; margin-top: 20px;">
              If you did not request this email, please ignore it. This link will expire in 24 hours.
            </p>
            <p style="font-size: 14px; color: #555555; margin-top: 30px; text-align: center;">
              &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// export default emailVerificationTemplate;
