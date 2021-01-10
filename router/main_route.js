var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var router = express();
var db = require('../db');
var infos;
router.use(express.bodyParser());

router.use(session({
    secret: 'McLovin',
    cookie: {
        maxAge: 300000
    }
}));

router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

router.get('/', (req, res) => {
    res.render('pages/home')
});

router.get('/infos', (req, res) => {
    if (req.session.val) {
        next()
    } else {
        console.log(infos)
        res.render('pages/infos', {
            infos: infos
        })
    }
});

router.post('/dados', (req, res) => {
    db.query.p(req.body, (cb) => {
        if (cb) {
            infos = cb
            req.session.val = cb.api_info
            res.send({
                status: 1,
                infos: cb
            })
        }
    })
});

module.exports = router;