import { mailtrapClient, sender } from "./mailtrap.config.js";
import {VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE} from "./emailTemplates.js";
export const  sendVerificationEmail=async(email,verificationToken)=>{
    const recipient = [{email}]

    try {
        const response=await mailtrapClient.send({
            from: sender,
            to:recipient,
            subject: "Verify your email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        });

        console.log("Email sent successfully:", response);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send verification email");
    }
}

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try{
   const response= await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid:"f245e358-1da1-4f47-87ff-9aa7d69350f1",
      template_variables: {
         "company_info_name": "Aniket's Org",
      "name": name,
      "company_info_address": "Rajasthan",
      "company_info_city": "Udaipur",
      "company_info_zip_code": "313001",
      "company_info_country": "India"
      }
  })
    console.log("Welcome email sent successfully:", response);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send verification email");
  }

}

  export const sendResetPassordEmail = async (email, resetURL) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    })
  }
catch(error){
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
}