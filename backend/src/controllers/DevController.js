const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {
    async index(req, res) {
        // console.log(req);

        const { user } = req.headers;
        const loggedDev = await Dev.findById(user);
        
        // query criteria
        const users = await Dev.find({
            $and: [
                // doest not includes current user in the list of liked/disliked people
                { _id: { $ne: user } },

                // ignores liked people
                { _id: { $nin: loggedDev.likes } },

                // ignores disliked people
                { _id: { $nin: loggedDev.dislikes } },
            ],
        });

        return res.json(users);
    },
    
    async store(req, res) {
        // Desestruturação: obtém 'username' do objeto req.body
        const { username } = req.body;

        const userExists = await Dev.findOne({ user: username });
        if (userExists) {
            console.log('this user is already saved!');
            return res.json(userExists);
        }

        // acessa api do github para obter o avatar
        const response = await axios.get(`https://api.github.com/users/${username}`);
        
        // get info from response.data
        const { name, bio, avatar_url: avatar } = response.data;

        const dev = await Dev.create({ 
            user: username,
            name: name,
            bio: bio,
            avatar: avatar
        });

        return res.json(dev);
    }
};
