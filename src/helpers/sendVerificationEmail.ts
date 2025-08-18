import { sendEmail } from "@/lib/emailService";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        console.log('Attempting to send verification email:', {
            to: email,
            username: username,
            code: verifyCode
        });

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Hello ${username},</h2>
                <p>Thank you for registering with Mystery Message. Please use the following verification code to complete your registration:</p>
                <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
                    ${verifyCode}
                </div>
                <p>If you did not request this code, please ignore this email.</p>
                <p>This code will expire in 1 hour.</p>
                <br>
                <p>Best regards,<br>Mystery Message Team</p>
            </div>
        `;

        const result = await sendEmail(
            email,
            'Mystery Message - Verification Code',
            htmlContent
        );

        if (!result.success) {
            throw result.error;
        }

        return { success: true, message: 'Verification email sent successfully' };
    } catch (error) {
        console.error("Error sending verification email:", {
            error,
            email,
            username,
            verifyCode
        });
        return {
            success: false,
            message: 'Failed to send verification email. Please try again later.'
        };
    }
}