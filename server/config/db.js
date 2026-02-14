import mongoose from "mongoose";

const connectDB = async () => {
  try {

    mongoose.connection.on("connected", () =>
      console.log("Database Connected")
    );

    await mongoose.connect(`${process.env.MONGO_URI}/TrackHire`);

  } catch (error) {
    console.error("DB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
