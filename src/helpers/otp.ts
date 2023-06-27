import otpGenerator from 'otp-generator'

const accountSid = process.env.OTP_ACCOUNT_SID;
const authToken = process.env.OTP_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// Sending an OTP SMS
export const sendOtp = (recipientNumber:string, generatedOTP:string)=>{
    client.messages
    .create({
      body: `Your OTP: ${generatedOTP}`,
      from: process.env. OTP_PHONE,
      to: recipientNumber
    })
    .then((message: any) => console.log('OTP sent successfully! Message SID:', message.sid))
    .catch((error: any) => console.error('Failed to send OTP. Error:', error));
}


export const generateOTP = (length: number) => {
  const OTP = otpGenerator.generate(length, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false
  })

  return OTP
}
console.log(generateOTP(6))