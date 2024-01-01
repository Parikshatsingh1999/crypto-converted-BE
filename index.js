import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import { router } from "./router/index.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

const options = [
    cors({
        origin: '*',
        methods: '*',
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
];

app.use(options);


app.use("/api", router)

app.use("*", (req, res) => {
    return res.status(400).json({ error: "Path doesnt exist" });
})

app.listen(PORT, (err) => {
    console.log(`express server running on port ${PORT}`);
})