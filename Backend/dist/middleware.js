"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jsonwebtoken_1.default.verify(token, "code");
    if (!decoded) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    //@ts-ignore
    req.userId = decoded.id;
    next();
};
exports.authMiddleware = authMiddleware;
// how to override the types of the expres request obejct
