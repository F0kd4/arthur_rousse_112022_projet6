const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        //Retrait du terme BEARER du header
        const token = req.headers.authorization.split(' ')[1];
        //Vérification du token par de le code secret de décryptage
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};