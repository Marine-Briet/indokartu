const jwt = require('jsonwebtoken');

const checkJWT = async (req, res, next) => {
    
    try {
        let token = req.headers.authorization;
        
        if (!token) {
            return res.status(401).json({ message: 'Token requis' });
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.decoded = decoded;
        next();
    } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
};

const checkAdmin = (req, res, next) => {

    if (req.decoded.est_admin === true) {
        next ();
    } else {
        return res.status(403).json({ message: 'Non autorisé' });
    }
};



module.exports = { checkJWT, checkAdmin };