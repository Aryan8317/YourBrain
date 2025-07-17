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
const app = (0, express_1.default)();
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = require("./middleware");
app.use(express_1.default.json());
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
app.post("/api/vi/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //validate the data and a
    const { username, password } = req.body;
    const user = yield db_1.UserModel.findOne({ username });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }
    //hash the password
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    db_1.UserModel.create({ username, password: hashedPassword });
    res.json({ message: "User created successfully" });
}));
app.post("/api/vi/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield db_1.UserModel.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    if (!user.password) {
        return res.status(400).json({ message: "User has no password set" });
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
    }
    const payload = { id: user._id };
    const token = jsonwebtoken_1.default.sign(payload, "code", { expiresIn: "1h" });
    res.json({ token });
}));
app.post("/api/vi/content", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, link } = req.body;
    //@ts-ignore
    const content = yield db_1.ContentModel.create({ title, link, userId: req.userId, tags: [] });
    res.json({ message: "Content created successfully", content });
}));
app.get("/api/vi/content", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const content = yield db_1.ContentModel.find({ userId: req.userId });
    res.json({ content });
}));
app.delete("/api/vi/content", (req, res) => { });
app.post("/api/vi/share", (req, res) => { });
app.post("/api/vi/share", (req, res) => { });
app.get("/get/v1/brain/:shareLink", (req, res) => {
});
