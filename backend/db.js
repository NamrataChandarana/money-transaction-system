import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_LINK, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((c) => {
      console.log(`connectd ${c.connection.host}`);
    });
};