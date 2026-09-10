import nodemailer, { Transporter } from 'nodemailer';
import { logger } from '../utils/logger';

interface SendDecisionEmailOptions {
  to: string;
  candidateName: string;
  jobTitle: string;
  type: 'SELECTED' | 'NOT_SELECTED';
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

// Create reusable transporter (lazy initialized)
let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });
    logger.info(`[EmailService] SMTP transporter configured for host: ${host}`);
    return transporter;
  }

  return null;
}

const DEFAULT_FROM = process.env.SMTP_FROM || 'Veenero Careers <udaygedam@veenerosolutions.com>';

export async function sendDecisionEmail(options: SendDecisionEmailOptions): Promise<SendEmailResult> {
  const { to, candidateName, jobTitle, type } = options;
  const isSelected = type === 'SELECTED';

  const subject = 'Veenero Sustainable Solutions — Application Update';

  const plainText = isSelected
    ? `Dear ${candidateName},

Thank you for applying for the ${jobTitle} position at Veenero Sustainable Solutions.

We are pleased to inform you that your profile has been shortlisted/selected to proceed to the next round of our recruitment process.

Our team will share the next steps with you shortly.

Regards,
Veenero Sustainable Solutions Pvt Ltd
udaygedam@veenerosolutions.com`
    : `Dear ${candidateName},

Thank you for your interest in the ${jobTitle} position at Veenero Sustainable Solutions and for taking the time to apply.

After reviewing your application, we have decided not to move forward with your candidature for this role at this time.

We appreciate your interest in Veenero Sustainable Solutions and wish you all the best for your future opportunities.

Regards,
Veenero Sustainable Solutions Pvt Ltd
udaygedam@veenerosolutions.com`;

  const htmlContent = isSelected
    ? `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 32px 16px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
    <div style="background: linear-gradient(135deg, #04161d 0%, #0a3641 100%); padding: 28px 32px; border-bottom: 2px solid #14b8a6;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">VEENERO SUSTAINABLE SOLUTIONS</h1>
      <p style="color: #5eead4; margin: 4px 0 0 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Recruitment Team</p>
    </div>
    <div style="padding: 32px; font-size: 15px; line-height: 1.65; color: #334155;">
      <p style="margin-top: 0;">Dear <strong>${candidateName}</strong>,</p>
      <p>Thank you for applying for the <strong>${jobTitle}</strong> position at Veenero Sustainable Solutions.</p>
      
      <div style="background: #f0fdfa; border-left: 4px solid #0d9488; padding: 16px; border-radius: 8px; margin: 24px 0;">
        <p style="margin: 0; color: #115e59; font-weight: 600;">
          We are pleased to inform you that your profile has been shortlisted to proceed to the next round of our recruitment process.
        </p>
      </div>

      <p>Our team is currently finalizing schedules and will share the next steps and interview details with you shortly.</p>
      <p>If you have any questions in the meantime, feel free to reach out to us at <a href="mailto:udaygedam@veenerosolutions.com" style="color: #0d9488; text-decoration: underline;">udaygedam@veenerosolutions.com</a>.</p>
      
      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
        <p style="margin: 0 0 4px 0;"><strong>Regards,</strong></p>
        <p style="margin: 0 0 4px 0; color: #0f172a; font-weight: 600;">Veenero Sustainable Solutions Pvt Ltd</p>
        <p style="margin: 0;"><a href="mailto:udaygedam@veenerosolutions.com" style="color: #0d9488; text-decoration: none;">udaygedam@veenerosolutions.com</a></p>
      </div>
    </div>
  </div>
</body>
</html>
`
    : `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 32px 16px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
    <div style="background: linear-gradient(135deg, #04161d 0%, #0a3641 100%); padding: 28px 32px; border-bottom: 2px solid #0d9488;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">VEENERO SUSTAINABLE SOLUTIONS</h1>
      <p style="color: #5eead4; margin: 4px 0 0 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Recruitment Team</p>
    </div>
    <div style="padding: 32px; font-size: 15px; line-height: 1.65; color: #334155;">
      <p style="margin-top: 0;">Dear <strong>${candidateName}</strong>,</p>
      <p>Thank you for your interest in the <strong>${jobTitle}</strong> position at Veenero Sustainable Solutions and for taking the time to apply.</p>
      
      <p>After carefully reviewing your application and experience against the current requirements for this position, we have decided not to move forward with your candidature for this role at this time.</p>

      <p>We truly appreciate the time and effort you invested in applying to Veenero Sustainable Solutions and wish you all the best in your professional journey and future career opportunities.</p>
      
      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
        <p style="margin: 0 0 4px 0;"><strong>Regards,</strong></p>
        <p style="margin: 0 0 4px 0; color: #0f172a; font-weight: 600;">Veenero Sustainable Solutions Pvt Ltd</p>
        <p style="margin: 0;"><a href="mailto:udaygedam@veenerosolutions.com" style="color: #0d9488; text-decoration: none;">udaygedam@veenerosolutions.com</a></p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  const activeTransporter = getTransporter();

  if (activeTransporter) {
    try {
      const info = await activeTransporter.sendMail({
        from: DEFAULT_FROM,
        to,
        subject,
        text: plainText,
        html: htmlContent,
      });
      logger.success(`[EmailService] Decision email sent to ${to} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      logger.error(`[EmailService] SMTP send failed to ${to}: ${err.message}`);
      return { success: false, error: err.message };
    }
  } else {
    // Development / No SMTP simulation
    logger.info(`[EmailService:Simulated] Decision email '${type}' generated for ${to}:`);
    logger.info(`[EmailService:Subject] ${subject}`);
    logger.info(`[EmailService:Body]\n${plainText}`);
    return { success: true, simulated: true };
  }
}
