import otpGenerator from 'otp-generator'
import axios from 'axios'


const accountSid = process.env.OTP_ACCOUNT_SID;
const authToken = process.env.OTP_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

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


export const sendSMS = (phone: String, msg: String) => {
    axios({
        url: process.env.SMS_URL,
        method: "POST",
        data: {
            'msg': msg,
            'phone': phone,
            'token': process.env.SMS_TOKEN
        }
    })
        .then(response => {
            console.log(response.data.url)
        })
        .catch(error => {
            console.log(error)
        })
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
