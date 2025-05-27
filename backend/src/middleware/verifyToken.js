import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    try {
        if(!token) return res.status(401).json({ message: 'No token provided' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return res.status(401).json({ message: 'Invalid token' });
        req.userId = decoded.userId; 
        next();
    } catch (error) {
        console.error('Token verification error  middleware:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};


