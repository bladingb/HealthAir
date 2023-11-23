import { MONGO_URI } from "#/utils/variables";
import mongoose from "mongoose";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("DB is connected");
  })
  .catch((err) => {
    console.log("DB connection failed: ", err);
  });
