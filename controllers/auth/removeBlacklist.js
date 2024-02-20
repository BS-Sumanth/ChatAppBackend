const User = require('../../models/user');
const BlackList = require('../../models/blacklist');

const removeBlacklist = async (req, res) => {
    try {
        const { mail } = req.body;

        const userBlackListed = await BlackList.exists({ mail: mail.toLowerCase() });

        if (userBlackListed) {
            await BlackList.deleteOne({mail:mail.toLowerCase()});
        }

        res.status(200).json({message:"Email removed from blackList"});
    } catch (err) {
        console.error(err);
        return res.status(500).send("Error occured. Please try again");
    }
};

module.exports = removeBlacklist;