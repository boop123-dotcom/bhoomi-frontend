require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const accomplishmentRoutes = require("./routes/accomplishments"); 

const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:3000", 
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
    allowedHeaders: "Content-Type",
}));

app.use("/accomplishments", accomplishmentRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("🟢 Connected to MongoDB"))
    .catch((err) => console.error("🔴 MongoDB Connection Error:", err));

app.listen(5001, () => console.log("🟢 Server running on port 5000"));
