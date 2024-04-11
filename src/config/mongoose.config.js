import mongoose from "mongoose";

export const connectToMongoose = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_URL).then(() => {
      console.log("Database is connected");
    });
  } catch (err) {
    console.log(err);
  }
};
