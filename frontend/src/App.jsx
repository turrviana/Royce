import { useState } from "react";
import axios from "axios";

function App() {
  const [preco, setPreco] = useState("");
  const [metragem, setMetragem] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [mostrarErro, setMostrarErro] = useState(false);

  const LIMITE_USO = 3;

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(valor);
  };

  const exibirErro = (msg) => {
    setErro(msg);
    setMostrarErro(true);

    setTimeout(() => {
      setMostrarErro(false);
    }, 2500);

    setTimeout(() => {
      setErro("");
    }, 3000);
  };

  const getUsoAtual = () => {
    return Number(localStorage.getItem("usoRoyce") || 0);
  };

  const incrementarUso = () => {
    const atual = getUsoAtual();
    localStorage.setItem("usoRoyce", atual + 1);
  };

  const analisarImovel = async () => {
    if (!preco || !metragem || !localizacao) {
      exibirErro("Preencha todos os campos");
      return;
    }

    if (Number(metragem) <= 0) {
      exibirErro("Metragem inválida");
      return;
    }

    const usoAtual = getUsoAtual();

    if (usoAtual >= LIMITE_USO) {
      exibirErro("Limite de análises atingido (3)");
      return;
    }

    try {
      setLoading(true);
      setResultado(null);

      const res = await axios.post("https://royce-1jth.onrender.com/imoveis/analisar", {
        preco: Number(preco),
        metragem: Number(metragem),
        localizacao
      });

      incrementarUso();
      setResultado(res.data);

    } catch (err) {
      exibirErro("Erro ao analisar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  
  const usoAtual = getUsoAtual();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">

        <h1 className="text-2xl font-bold mb-2 text-center">
          Royce
        </h1>

        <p className="text-center text-gray-500 mb-2">
          Análise inteligente de imóveis
        </p>

        <p className="text-center text-sm text-gray-400 mb-4">
          {usoAtual} / {LIMITE_USO} análises usadas
        </p>

        <div className="mb-3">
          <label htmlFor="preco" className="block text-sm font-medium mb-1">
            Preço do imóvel
          </label>
          <input
            id="preco"
            type="number"
            placeholder="Ex: 300000"
            className="w-full p-2 border rounded-lg mb-3"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="metragem" className="block text-sm font-medium mb-1">
            Metragem (m²)
          </label>
          <input
            id="metragem"
            type="number"
            placeholder="Ex: 60"
            className="w-full p-2 border rounded-lg mb-3"
            value={metragem}
            onChange={(e) => setMetragem(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="localizacao" className="block text-sm font-medium mb-1">
            Localização
          </label>
          <input
            type="text"
            placeholder="Ex: São Paulo"
            className="w-full p-2 border rounded-lg mb-3"
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
          />
        </div>

        {erro && (
          <p
            className={`text-red-500 text-sm mb-3 text-center transition-opacity duration-500 ${
              mostrarErro ? "opacity-100" : "opacity-0"
            }`}
          >
            {erro}
          </p>
        )}

        <button
          onClick={analisarImovel}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Analisando..." : "Analisar"}
        </button>

        {loading && (
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        )}

        {resultado && !loading && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Resultado</h2>

            <p>
              <strong>Preço por m²:</strong>{" "}
              {formatarMoeda(resultado.preco_m2)}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span className={
                resultado.status === "barato"
                  ? "text-green-600"
                  : resultado.status === "caro"
                  ? "text-red-600"
                  : "text-gray-600"
              }>
                {resultado.status}
              </span>
            </p>

            <p className="mt-2 text-sm text-gray-700">
              {resultado.analise}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;