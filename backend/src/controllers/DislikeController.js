const Dev = require('../models/Dev');

module.exports = {
    async store(req, res) {
        const { user } = req.headers;
        const { devId } = req.params;

        // get all
        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        if (!targetDev) {
            return res.status(400).json({ error: 'dev doest not exists' });
        }
        
        loggedDev.dislikes.push(targetDev._id);
        await loggedDev.save();

        return res.json({ loggedDev: loggedDev });
    }
};