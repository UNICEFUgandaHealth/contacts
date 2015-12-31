var ContactService = require('./contacts-service')();
var corsMiddleware = require('./middleware/cors')();

var express = require('express');
var bodyParser = require('body-parser');
var util = require('util');

var app = express();
var router = express.Router();
var port = process.env.PORT || 8005;

app.use(require('express-domain-middleware'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

app.use(allowCrossDomain);

app = corsMiddleware.allowCors(app);

router.get('/', ContactService.welcomeMessage);

router.get('/contacts/', ContactService.find);

router.get('/contacts/:id', ContactService.findById);

router.post('/contacts/', ContactService.add);

router.put('/contacts/', ContactService.edit);

router.delete('/contacts/:id', ContactService.delete);

app.use('/api', router);

app.listen(port);

// Do logging and user-friendly error message display
app.use(function errorHandler(err, req, res, next) {
    console.log('Error: %d %s %s: %j', process.domain.id, req.method, req.url, util.inspect(err, {showHidden: false, depth: 1}));
    if (!err.status) {
        return res.status(500).json({error: 'Service internal error'})
    }

    res.status(err.status).send({error: err.message});
});

module.exports = app;
