import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import AppRoutes from "./Routes/index.js";

dotenv.config(); // Load environment variables from .env file

const app = express();
const Port = 5010;

// MongoDB connection URL from environment variables
const connection_Url = process.env.connectionUrl;

// Middleware setup
app.use(cors());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

// Connect to MongoDB
mongoose
  .connect(connection_Url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Error connecting to database: " + err.message));

// Use routes from the Routes folder
app.use("/", AppRoutes);

// Start the server
app.listen(Port, () => {
  console.log(`Server is running at http://localhost:${Port}`);
});
