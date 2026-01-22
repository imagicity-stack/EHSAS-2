import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || "";
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || "ehsas@eldenheights.org";
const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || "EHSAS - Elden Heights School Alumni Society";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASSWORD } : undefined,
});

export const sendEmail = async (toEmail, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `${SMTP_FROM_NAME} <${SMTP_FROM_EMAIL}>`,
      to: toEmail,
      subject,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${toEmail}:`, error);
    return false;
  }
};

export const sendRegistrationNotification = async (alumniData) => {
  const subject = `New Alumni Registration - ${alumniData.first_name} ${alumniData.last_name}`;
  const htmlContent = `
    <html>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; color: #2D2D2D; max-width: 600px; margin: 0 auto;">
        <div style="background: #8B1C3A; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">EHSAS</h1>
            <p style="color: #C9A227; margin: 10px 0 0 0; font-size: 14px;">New Alumni Registration</p>
        </div>
        <div style="padding: 30px; background: #FAF8F3;">
            <h2 style="color: #8B1C3A; margin-top: 0;">Registration Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #E8E0D0;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E8E0D0;">${alumniData.first_name} ${alumniData.last_name}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #E8E0D0;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E8E0D0;">${alumniData.email}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #E8E0D0;"><strong>Mobile:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E8E0D0;">${alumniData.mobile}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #E8E0D0;"><strong>Batch:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E8E0D0;">${alumniData.year_of_joining} - ${alumniData.year_of_leaving}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #E8E0D0;"><strong>City:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E8E0D0;">${alumniData.city}, ${alumniData.country}</td></tr>
            </table>
            <p style="margin-top: 20px;">Please login to the admin panel to approve or reject this registration.</p>
        </div>
        <div style="background: #6B0F2A; padding: 20px; text-align: center;">
            <p style="color: white; opacity: 0.7; margin: 0; font-size: 12px;">EHSAS - Elden Heights School Alumni Society</p>
        </div>
    </body>
    </html>
  `;

  return sendEmail(SMTP_FROM_EMAIL, subject, htmlContent);
};

export const sendApprovalEmail = async (alumniData, ehsasId) => {
  const subject = `Welcome to EHSAS! Your Membership ID: ${ehsasId}`;
  const htmlContent = `
    <html>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; color: #2D2D2D; max-width: 600px; margin: 0 auto;">
        <div style="background: #8B1C3A; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">EHSAS</h1>
            <p style="color: #C9A227; margin: 10px 0 0 0; font-size: 14px;">Elden Heights School Alumni Society</p>
        </div>
        <div style="padding: 30px; background: #FAF8F3;">
            <h2 style="color: #8B1C3A; margin-top: 0;">Congratulations, ${alumniData.first_name}!</h2>
            <p style="font-size: 16px; line-height: 1.6;">Your EHSAS membership has been <strong style="color: #8B1C3A;">approved</strong>. Welcome to the official alumni network of The Elden Heights School!</p>

            <div style="background: white; border: 2px solid #C9A227; padding: 25px; margin: 25px 0; text-align: center;">
                <p style="color: #4A4A4A; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Your EHSAS Membership ID</p>
                <p style="color: #8B1C3A; font-size: 32px; font-weight: bold; margin: 0; font-family: 'Courier New', monospace;">${ehsasId}</p>
            </div>

            <p style="font-size: 15px; line-height: 1.6;">As a member of EHSAS, you now have access to:</p>
            <ul style="font-size: 15px; line-height: 1.8; color: #4A4A4A;">
                <li>The Alumni Directory - Connect with fellow Eldenites</li>
                <li>Exclusive events and reunions</li>
                <li>Mentorship and networking opportunities</li>
                <li>Updates on school initiatives</li>
            </ul>

            <p style="font-size: 15px; margin-top: 25px;">We're excited to have you as part of our growing community. Your journey with Elden Heights continues!</p>

            <p style="color: #C9A227; font-style: italic; margin-top: 25px;">"EHSAS" - where memories meet the future.</p>
        </div>
        <div style="background: #6B0F2A; padding: 20px; text-align: center;">
            <p style="color: white; opacity: 0.7; margin: 0; font-size: 12px;">EHSAS - An official initiative of The Elden Heights School</p>
            <p style="color: white; opacity: 0.5; margin: 10px 0 0 0; font-size: 11px;">This is an automated email. Please do not reply directly.</p>
        </div>
    </body>
    </html>
  `;

  return sendEmail(alumniData.email, subject, htmlContent);
};

export const sendRejectionEmail = async (alumniData) => {
  const subject = "EHSAS Registration Update";
  const htmlContent = `
    <html>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; color: #2D2D2D; max-width: 600px; margin: 0 auto;">
        <div style="background: #8B1C3A; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">EHSAS</h1>
            <p style="color: #C9A227; margin: 10px 0 0 0; font-size: 14px;">Elden Heights School Alumni Society</p>
        </div>
        <div style="padding: 30px; background: #FAF8F3;">
            <h2 style="color: #2D2D2D; margin-top: 0;">Dear ${alumniData.first_name},</h2>
            <p style="font-size: 15px; line-height: 1.6;">Thank you for your interest in joining EHSAS - the Elden Heights School Alumni Society.</p>
            <p style="font-size: 15px; line-height: 1.6;">After reviewing your registration, we were unable to verify your details at this time. This could be due to:</p>
            <ul style="font-size: 15px; line-height: 1.8; color: #4A4A4A;">
                <li>Incomplete or incorrect information</li>
                <li>Unable to verify your enrollment records</li>
            </ul>
            <p style="font-size: 15px; line-height: 1.6;">If you believe this is an error, please contact us at <a href="mailto:ehsas@eldenheights.org" style="color: #8B1C3A;">ehsas@eldenheights.org</a> with your details and we'll be happy to assist.</p>
        </div>
        <div style="background: #6B0F2A; padding: 20px; text-align: center;">
            <p style="color: white; opacity: 0.7; margin: 0; font-size: 12px;">EHSAS - An official initiative of The Elden Heights School</p>
        </div>
    </body>
    </html>
  `;

  return sendEmail(alumniData.email, subject, htmlContent);
};
