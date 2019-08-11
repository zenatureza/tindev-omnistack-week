// Arquivo que define as rotas da aplicação
const express = require('express');
const routes = express.Router();
const DevController = require('./controllers/DevController');
const LikeController = require('./controllers/LikeController');
const DislikeController = require('./controllers/DislikeController');

// rota base
routes.get('/', (req, res) => {
    var params = req.query;
    console.log(params.name);
    
    return res.json({ msg: `ola ${params.name}` });
});

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);
routes.post('/devs/:devId/likes', LikeController.store);
routes.post('/devs/:devId/dislikes', DislikeController.store);

module.exports = routes;