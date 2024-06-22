import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_LINK, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((c) => {
      console.log(`connectd ${c.connection.host}`);
    });
};