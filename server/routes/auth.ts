import express, { Request, Response, NextFunction } from 'express';
import util from 'util';
import url from 'url';
import querystring from 'querystring';
import passport from 'passport';
import request from 'request-promise';

const router = express.Router();
module.exports = router;

router.get(
    '/login',
    // passport.authenticate('auth0', {
    //     scope: 'openid email profile read:AllUsers',
    //     authInfo: true,
    //     //audience: process.env.AUDIENCE,
    // }),
    function (req, res) {
        const options = {
            method: 'GET',
            url: `https://${process.env.AUTH0_DOMAIN}/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.CALLBACK_URL}&scope=openid%20email%20profile%20read:AllUsers&audience=${process.env.AUDIENCE}&state=eyJyZXR1cm5UbyI6Imh0dHA6Ly8xMC4xMC4xNTAuNTA6ODA4MCIsIm5vbmNlIjoiYmM5MmRlNDNmYjk0ZWQ5NTc0Y2QzMmU1NTE3NTYzMTEifQ&nonce=ddebdb0d96bc648619ceb0f6a5615b67`,
            simple: true,
        };
        res.redirect(options.url);
    },
);

// router.get('/callback', function (req, res, next) {
//     // passport.authenticate('auth0', function (err, user, info) {
//     //     console.log(req.authInfo);
//     //     if (err) {
//     //         return next(err);
//     //     }
//     //     if (!user) {
//     //         return res.redirect('/login');
//     //     }
//     //     req.logIn(user, function (err) {
//     //         if (err) {
//     //             return next(err);
//     //         }
//     //         const returnTo = req.session.returnTo;
//     //         delete req.session.returnTo;
//     //         res.redirect(returnTo || '/');
//     //     });
//     // })(req, res, next);
//     console.log(req);
//     console.log(res);
// });

router.get('/logout', (req, res) => {
    // req.logout();

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
