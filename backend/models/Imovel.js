import mongoose from "mongoose";

const ImovelSchema = new mongoose.Schema({
  preco: Number,
  metragem: Number,
  localizacao: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Imovel", ImovelSchema);
