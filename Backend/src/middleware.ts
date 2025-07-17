import { NextFunction, Request, Response } from "express";
import  jwt  from "jsonwebtoken";


export const authMiddleware = (req:Request, res :Response, next:NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, "code");
    if(!decoded){
        return res.status(401).json({ message: "Unauthorized" });
    }
    //@ts-ignore
    req.userId = decoded.id;
    next();
    
}
// how to override the types of the expres request obejct
