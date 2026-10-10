import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactNotificationData {
  name: string;
  email: string;
  organization?: string;
  subject: string;
  message: string;
}

export async function sendContactNotification(
  data: ContactNotificationData
): Promise<{ success: boolean; error?: string }> {
  try {
    const notificationEmail = process.env.NOTIFICATION_EMAIL || 'hrdc@srcc.du.ac.in';

    await resend.emails.send({
      from: 'HRDC SRCC Website <noreply@hrdc-srcc.org>',
      to: [notificationEmail],
      subject: `New Contact: ${data.subject}`,
      html: `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0F172A; margin-bottom: 24px;">New Contact Form Submission</h2>
          <div style="background: #F8FAFC; border-radius: 14px; padding: 24px; margin-bottom: 24px;">
            <p style="margin: 0 0 12px;"><strong>Name:</strong> ${data.name}</p>
            <p style="margin: 0 0 12px;"><strong>Email:</strong> ${data.email}</p>
            ${data.organization ? `<p style="margin: 0 0 12px;"><strong>Organization:</strong> ${data.organization}</p>` : ''}
            <p style="margin: 0 0 12px;"><strong>Subject:</strong> ${data.subject}</p>
          </div>
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; padding: 24px;">
            <p style="margin: 0 0 8px; font-weight: 600; color: #0F172A;">Message:</p>
            <p style="margin: 0; color: #475569; white-space: pre-wrap;">${data.message}</p>
          </div>
          <p style="margin-top: 24px; font-size: 14px; color: #64748B;">This message was sent from the HRDC SRCC website contact form.</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send contact notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send notification',
    };
  }
}

export async function sendContactConfirmation(
  data: ContactNotificationData
): Promise<{ success: boolean; error?: string }> {
  try {
    await resend.emails.send({
      from: 'HRDC SRCC <noreply@hrdc-srcc.org>',
      to: [data.email],
      subject: 'Thank you for contacting HRDC SRCC',
      html: `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0F172A; margin-bottom: 16px;">Thank You, ${data.name}</h2>
          <p style="color: #475569; line-height: 1.7;">We have received your message regarding <strong>"${data.subject}"</strong> and will get back to you shortly.</p>
          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
          <p style="color: #64748B; font-size: 14px;">Human Resource Development Cell<br/>Shri Ram College of Commerce<br/>University of Delhi</p>
          <p style="color: #64748B; font-size: 12px; font-style: italic;">Enable. Edify. Empower.</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send contact confirmation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send confirmation',
    };
  }
}
