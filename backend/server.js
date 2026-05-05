import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import imoveisRoutes from "./routes/imoveis.js";

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB conectado"))
    .catch(err => console.log(err));

app.use("/imoveis", imoveisRoutes);

app.get("/", (req, res)  => {
    res.send("API Royce rodando");
});

const PORT = process.env.PORT || 3459;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));