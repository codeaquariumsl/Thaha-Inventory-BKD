const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'CA@25';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

const authorizeTaxAccess = (req, res, next) => {
    // Roles that can access Tax orders
    const allowedRoles = ['admin', 'tax_user'];

    if (req.user && allowedRoles.includes(req.user.role)) {
        req.canAccessTax = true;
    } else {
        req.canAccessTax = false;
    }
    next();
};

module.exports = {
    authenticateToken,
    authorizeTaxAccess
};
