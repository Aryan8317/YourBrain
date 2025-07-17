import mongoose, { Schema, model } from 'mongoose';
mongoose.connect("mongodb+srv://starkarya8317:182uzP6LvHKv9JG0@yourname.ccd0rxw.mongodb.net/")
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });
const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String
});
export const UserModel = model("User", UserSchema);

const contentSchema = new Schema({
  title: String,
  link: String,  
  tags:[{ type: Schema.Types.ObjectId, ref: "Tags" }],
  userId: { type: Schema.Types.ObjectId, ref: "User",required:true}
});
export const ContentModel = model("Content", contentSchema); 
 