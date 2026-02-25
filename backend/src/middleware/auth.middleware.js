import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
    try {
        const token=req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({success:false, message: "No token provided. Please login." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password")

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" })
        }
        req.user = user;
        next();

    } catch (error) {
        if(error.name === "JsonWebTokenError") {
            return res.status(401).json({ success: false, message: "Invalid token." });
        }
        if(error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token expired." });
        }
        res.status(401).json({
            success:false,
            message: "Authentication failed."
        })

    }
}

export const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({ success: false, message: `This action requires one of these roles: ${allowedRoles.join(', ')}` });
        }
        next();
    };
};