import express from "express";
import Imovel from "../models/Imovel.js";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

router.post("/", async (req, res) => {
    try {
        const imovel = new Imovel(req.body);
        await imovel.save();
        res.json(imovel);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

router.post("/analisar", async (req, res) => {
    try {
        const { preco, metragem, localizacao } = req.body;

        const preco_m2 = preco / metragem;
        const media = 5000;

        let status = "justo";
        if (preco_m2 > media) status = "caro";
        if (preco_m2 < media) status = "barato";

        const prompt = `
        Você é um especialista imobiliário.

        Analise este imóvel e diga se vale a pena de forma breve:
        Preço: ${preco}
        Metragem: ${metragem}
        Localização: ${localizacao}
        Preço por m²: ${preco_m2}
        Média da região: ${media}

        Diga se vale a pena comprar e explique de forma simples.
        `
        ;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }]
        });

        const respostaIA = completion.choices[0].message.content;

        res.json({
            preco_m2,
            status,
            analise: respostaIA
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;