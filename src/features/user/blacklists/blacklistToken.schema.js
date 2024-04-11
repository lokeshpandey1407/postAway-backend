import mongoose from "mongoose";

const BlackListSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
export default BlackListSchema;
