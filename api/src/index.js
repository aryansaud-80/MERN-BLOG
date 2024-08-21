import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});
import app from "./app.js";

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error: ", error);
    });

    app.listen(PORT, () => {
      console.log("Server is running on port: ", PORT);
    });
  })
  .catch((error) => {
    console.log("MONGO db connection error: ", error);
  });
