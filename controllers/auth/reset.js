const User = require('../../models/user');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');

const reset = async (req, res) => {
    try {
        const { mail,password } = req.body;

        const user = await User.findOne({ mail: mail.toLowerCase() });

        if (!user) {
            return res.status(400).send('Email does not exist!');
        }

        if (!user.verified) {
            return res.status(409).send("Email not verified!");
        }

        if (user) {
            const token = jwt.sign(
                {
                    mail: mail.toLowerCase(),
                    password: password,
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "24h",
                }
            );

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "sumanthbs10603@gmail.com", // Your Gmail email address
                    pass: "amza oisv rdyx qgeu", // Your Gmail password or app-specific password
                },
            });
            console.log("No");
            const mailOptions = {
                from: "sumanthbs10603@gmail.com",
                to: mail,
                subject: "Email Verification",
                html: `<p>Please click <a href="http://localhost:5002/api/auth/new-password/${token}">here</a> to reset your password.</p>`,
            };
            console.log("NOOO");
            try {
                await transporter.sendMail(mailOptions);
                console.log("mail sent");
            } catch (error) {
                console.error("Error sending email:", error);
                throw error; // Rethrow the error to be caught by the outer try-catch block
            }

            console.log(password);
            return res.status(200).json({
                userDetails: {
                    mail: user.mail,
                    token: token,
                    password: password,
                },
            })
        }
    } catch (err) {
        return res.status(500).send('Something went wrong. Please try again');
    }
};

module.exports = reset;