const User = require('../../models/user');
const BlackList = require('../../models/blacklist');


const blacklist = async (req, res) => {
    try {
        const { mail } = req.body;

        const userBlackListed = await BlackList.exists({ mail: mail.toLowerCase() });

        if (userBlackListed) {
            return res.status(409).send("This email is already black listed.");
        }

        const userMailExists = await User.exists({ mail: mail.toLowerCase() });

        if (userMailExists) {
            await User.deleteOne({ mail: mail.toLowerCase() });

            await BlackList.create({
                mail: mail.toLowerCase(),
            })
        }
        else {
            await BlackList.create({
                mail: mail.toLowerCase(),
            })
        }


        res.status(201).json({
            userDetails: {
                mail: mail,
            }
        })
    } catch (err) {
        console.error(err);
        return res.status(500).send("Error occured. Please try again");
    }
};

module.exports = blacklist;