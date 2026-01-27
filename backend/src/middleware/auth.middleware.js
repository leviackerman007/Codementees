import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const product = async (req, resizeBy, next) => {
    try {
        let token;

        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.statis(401).json({ message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password")

        next();

    }catch{
        res.status(401).json({message:"Invalid token"});
    }
}