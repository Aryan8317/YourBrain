import express from 'express' ;
import { UserModel,ContentModel } from './db';
const app = express();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose, { Schema, model } from 'mongoose';
import { authMiddleware } from './middleware';
app.use(express.json());

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});

app.post("/api/vi/signup",async(req,res)=>{
    //validate the data and a
    const {username,password} = req.body;
    const user = await UserModel.findOne({username});
    if(user){
        return res.status(400).json({message:"User already exists"});
    }
    //hash the password
    const hashedPassword = await bcrypt.hash(password,10);
    UserModel.create({username,password:hashedPassword});
    res.json({message:"User created successfully"});
}
);


app.post("/api/vi/signin", async (req, res) => {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    if (!user.password) {
        return res.status(400).json({ message: "User has no password set" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
    }
    const payload = { id: user._id };
    const token = jwt.sign(payload, "code", { expiresIn: "1h" });
    res.json({ token });    
});

app.post("/api/vi/content",authMiddleware, async (req, res) => {
    const { title, link } = req.body;
    //@ts-ignore
    const content = await ContentModel.create({ title, link, userId: req.userId , tags:[]});
    res.json({ message: "Content created successfully", content });  

});
app.get("/api/vi/content",authMiddleware, async (req, res) => {
    //@ts-ignore
    const content = await ContentModel.find({ userId: req.userId }).populate("userId","username");
    res.json({ content });
});


app.delete("/api/vi/content",authMiddleware,async(req,res)=>{
    const contentId = req.body.contentId;
  //@ts-ignore
    const content = await ContentModel.deleteMany({_id:contentId,userId:req.userId});
    res.json({ message: "Content deleted successfully", content });
}
);


app.post("/api/vi/share",(req,res)=>{}
);

app.post("/api/vi/share", (req, res) => {});

app.get("/get/v1/brain/:shareLink", (req, res) => {
    
}
);
