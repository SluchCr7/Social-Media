const mail = require('nodemailer')

const sendEmail = async(useremail , subject , htmlTemplet) => {
    try {
        const transporter = mail.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_NAME, // sender
                pass : process.env.EMAIL_APP_PASS
            }
        })
        await transporter.sendMail({
            from: process.env.EMAIL_NAME,
            to: useremail,
            subject: subject,
            html: htmlTemplet
        })
    } catch (error) {
        console.log(error)
        throw new Error("Server Error (nodeMail)")
    }
}


module.exports = sendEmail