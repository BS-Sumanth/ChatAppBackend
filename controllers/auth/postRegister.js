const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const postRegister = async (req, res) => {
    try {
        const { username, mail, password } = req.body;

        console.log("user register request came");
        // check if user exists
        const userExists = await User.exists({ mail: mail.toLowerCase() });

        console.log(userExists);

        if (userExists) {
            return res.status(409).send("E-mail already in use.");
        }

        console.log("Creating jwt");
        // create JWT token
        const token = jwt.sign(
            {
                mail: mail.toLowerCase(),
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "24h",
            }
        );

        console.log(token);
        // Send verification email using your Gmail account
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
            html: `<p>Please click <a href="http://localhost:5002/api/auth/verify-email/${token}">here</a> to verify your email address.</p>`,
        };
        console.log("NOOO");
        try {
            await transporter.sendMail(mailOptions);
            console.log("mail sent");
        } catch (error) {
            console.error("Error sending email:", error);
            throw error; // Rethrow the error to be caught by the outer try-catch block
        }
        // encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);


        // create user document and save in database

        const user = await User.create({
            username,
            mail: mail.toLowerCase(),
            password: encryptedPassword,
            admin: false,
            verified: false, // Mark user as unverified
            verificationToken: token, // Save verification token
        });


        res.status(201).json({
            userDetails: {
                mail: user.mail,
                token: token,
                username: user.username,
                _id: user._id,
            },
        });
    } catch (err) {
        return res.status(500).send("Error occured. Please try again");
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        console.log(token);

        // Verify the verification token
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);

        // Find the user with the email associated with the verification token
        const user = await User.findOneAndUpdate(
            { mail: decoded.mail },
            { $set: { verified: true }, $unset: { verificationToken: "" } },
            { new: true }
        );

        if (!user) {
            return res.status(404).send("User not found.");
        }

        res.redirect("http://localhost:3000/login"); // Redirect to login page after successful verification
    } catch (err) {
        console.error(err);
        return res.status(500).send("Error occurred while verifying email.");
    }
};

const newPassword = async (req, res) => {
    try {
        const { token } = req.params;
        console.log(token);

        // Verify the verification token
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);

        const encryptedPassword = await bcrypt.hash(decoded.password, 10);

        console.log(decoded.password);
        const user = await User.findOneAndUpdate(
            { mail: decoded.mail },
            { $unset: { verificationToken: "" }, $set: { password: encryptedPassword } },
        );


        res.redirect("http://localhost:3000/newpassword"); // Redirect to login page after successful verification
    } catch (err) {
        console.error(err);
        return res.status(500).send("Error occurred while verifying email.");
    }
};

module.exports = { postRegister, verifyEmail, newPassword };
