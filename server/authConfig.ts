const auth_config = {
    required: false,
    auth0Logout: true,
    appSession: {
        secret: process.env.CLIENT_SECRET,
    },
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    authorizationParams: {
        response_type: 'code',
        audience: process.env.AUDIENCE,
        scope: 'openid profile email read:AllUsers',
    },
    clientSecret: process.env.CLIENT_SECRET,
    handleCallback: function (req, res, next) {
        req.session.openidTokens = req.openidTokens;
        next();
    },
};

export default auth_config;
