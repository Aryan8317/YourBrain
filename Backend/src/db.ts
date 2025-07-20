import mongoose, { model, Schema } from "mongoose";

mongoose.connect("mongodb+srv://starkarya8317:182uzP6LvHKv9JG0@yourname.ccd0rxw.mongodb.net/").then(()=>
    console.log("connected to db")
).catch(()=>console.log("db connection failed"));

const UserSchema = new Schema({
    username: { type: String, unique: true },
    password: { type: String }
});

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
    title: String,
    link: String, // lowercase
    type:String,
    tags: [{ type: mongoose.Types.ObjectId, ref: "tag" }],
    userId: [{ type: mongoose.Types.ObjectId, ref: "User", required: true }],
});

export const ContentModel = model("Content", ContentSchema);

const LinkSchema = new Schema({
    hash: String,
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
});

export const LinkModel = model("Links", LinkSchema);