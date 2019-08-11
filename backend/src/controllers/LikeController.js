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

        // when loggedDev is trying to like targetDev, verifies first if targetDev already liked loggedDev (its a match!)
        if (targetDev.likes.includes(loggedDev._id)) {
            console.log('its a match between' + targetDev.name + 'and ' + loggedDev.name);

            // warns the two match users
            const loggedSocket = req.connectedUsers[user];
            const targetSocket = req.connectedUsers[devId];

            // if they are connected in the application, all of them will receive the message
            if (loggedSocket) {
                // warns through the websocket (available through the req variable passed from the server.js)
                req.io.to(loggedSocket).emit('match', targetDev);
            }
            
            // warns the person who received like from the logged user
            if (targetSocket) {
                // warns the targetsocket related to the target dev, that it was a between
                // targetdev and loggeddev (emit('match', loggedDev))
                req.io.to(targetSocket).emit('match', loggedDev);
            }
        }

        loggedDev.likes.push(targetDev._id);
        await loggedDev.save();

        return res.json({ loggedDev: loggedDev });
    }
};