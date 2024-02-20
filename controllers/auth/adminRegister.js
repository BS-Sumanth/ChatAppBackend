const User = require('../../models/user');
const BlackList = require('../../models/blacklist');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminRegister = async (req, res) => {
    let user;
    try {
        const { username, mail, password } = req.body;

        const userBlackListed = await BlackList.exists({ mail: mail.toLowerCase() });

        if (userBlackListed) {
            return res.status(409).send("This email is black listed.");
        }

        const userMailExists = await User.exists({ mail: mail.toLowerCase() });

        if (userMailExists) {
            user = await User.updateOne({
                admin:true
            })
        }

        else{

        const encryptedPassword = await bcrypt.hash(password, 10);

        user = await User.create({
            username,
            mail: mail.toLowerCase(),
            password: encryptedPassword,
            admin: true
        });
    }
        const token = jwt.sign(
            {
                userId: user._id,
                mail
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "24h",
            }
        );

        res.status(201).json({
            userDetails: {
                mail: user.mail,
                token: token,
                username: user.username,
            }
        })
    } catch (err) {
        console.error(err);
        return res.status(500).send("Error occured. Please try again");
    }
};

module.exports = adminRegister;