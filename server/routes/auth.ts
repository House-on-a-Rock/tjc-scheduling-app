import express, { Request, Response, NextFunction } from 'express';
import util from 'util';
import url from 'url';
import querystring from 'querystring';
import passport from 'passport';

const router = express.Router();
module.exports = router;

router.get(
    '/login',
    passport.authenticate('auth0', {
        scope: 'openid email profile read:AllUsers',
    }),
    function (req, res) {
        res.redirect('/');
    },
);

router.get('/callback', function (req, res, next) {
    passport.authenticate('auth0', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            res.redirect(returnTo || '/user');
        });
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();

    let returnTo = req.protocol + '://' + req.hostname;
    const port = 8080;
    if (port !== undefined) {
        returnTo += ':' + port;
    }
    const logoutURL = new url.URL(
        util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN),
    );

    const searchString = querystring.stringify({
        client_id: process.env.CLIENT_ID,
        returnTo: returnTo,
    });
    logoutURL.search = searchString;
    res.redirect(logoutURL.href);
});
