"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
const JWT_SECRET = "code";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "http://localhost:5173" }));
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        yield db_1.UserModel.create({ username, password });
        res.json({ message: "User signed up" });
    }
    catch (e) {
        res.status(409).json({ message: "User already exists" });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = yield db_1.UserModel.findOne({ username, password });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, JWT_SECRET);
        res.json({ token });
    }
    else {
        res.status(403).json({ message: "Incorrect credentials" });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type, title } = req.body;
    yield db_1.ContentModel.create({
        link,
        type,
        title,
        userId: req.userId,
        tags: []
    });
    res.json({ message: "Content added" });
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const content = yield db_1.ContentModel.find({ userId: userId }).populate("userId", "username");
    res.json(content);
}));
app.delete("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    yield db_1.ContentModel.deleteMany({ contentId, userId: req.userId });
    res.json({ message: "Deleted" });
}));
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { share } = req.body;
    if (share) {
        const existingLink = yield db_1.LinkModel.findOne({ userId: req.userId });
        if (existingLink) {
            res.json({ hash: existingLink.hash });
            return;
        }
        const hash = (0, utils_1.random)(10);
        yield db_1.LinkModel.create({ userId: req.userId, hash });
        res.json({ hash });
    }
    else {
        yield db_1.LinkModel.deleteOne({ userId: req.userId });
        res.json({ message: "Removed link" });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield db_1.LinkModel.findOne({ hash });
    if (!link) {
        res.status(404).json({ message: "Invalid share link" });
        return;
    }
    const content = yield db_1.ContentModel.find({ userId: link.userId });
    const user = yield db_1.UserModel.findOne({ _id: link.userId });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json({
        username: user.username,
        content
    });
}));
app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
