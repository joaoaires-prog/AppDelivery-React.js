"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { Plus, Search, Edit, Trash2, X, Upload, Save } from "lucide-react";
import ProdutoForm from "../../Components/Admin/ProdutoForm";

// Dados simulados dos produtos por restaurante
// <--- MUDANÇA FUTURA: Substitua estes dados simulados por chamadas à API do seu backend!
const produtosPorRestaurante = {
  mais1cafe: [
    {
      id: 1,
      nome: "Café Expresso",
      preco: 4.5,
      disponivel: true,
      imagem: "https://via.placeholder.com/80x80/F59E0B/FFFFFF?text=Café",
      descricao: "Café expresso tradicional",
    },
    {
      id: 2,
      nome: "Cappuccino",
      preco: 6.0,
      disponivel: true,
      imagem: "https://via.placeholder.com/80x80/F59E0B/FFFFFF?text=Cap",
      descricao: "Cappuccino cremoso",
    },
    {
      id: 3,
      nome: "Croissant",
      preco: 8.0,
      disponivel: false,
      imagem: "https://via.placeholder.com/80x80/F59E0B/FFFFFF?text=Croi",
      descricao: "Croissant francês",
    },
  ],
  apetitis: [
    {
      id: 4,
      nome: "Hambúrguer Artesanal",
      preco: 25.0,
      disponivel: true,
      imagem: "https://via.placeholder.com/80x80/10B981/FFFFFF?text=Ham",
      descricao: "Hambúrguer com carne artesanal",
    },
    {
      id: 5,
      nome: "Batata Frita",
      preco: 12.0,
      disponivel: true,
      imagem: "https://via.placeholder.com/80x80/10B981/FFFFFF?text=Bat",
      descricao: "Batata frita crocante",
    },
  ],
  picapau: [
    {
      id: 6,
      nome: "Crepe Doce",
      preco: 15.0,
      disponivel: true,
      imagem: "https://via.placeholder.com/80x80/F97316/FFFFFF?text=Doce",
      descricao: "Crepe com nutella e morango",
    },
    {
      id: 7,
      nome: "Crepe Salgado",
      preco: 18.0,
      disponivel: true,
      imagem: "https://via.placeholder.com/80x80/F97316/FFFFFF?text=Salg",
      descricao: "Crepe com frango e queijo",
    },
  ],
};

export default function EditarProdutos() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // O restaurante sempre será o do usuário logado
  const restaurante = user?.restaurante || "mais1cafe";

  const [produtos, setProdutos] = useState(
    produtosPorRestaurante[restaurante] || []
  );
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    disponivel: true,
    imagem: "https://via.placeholder.com/80x80/8B5CF6/FFFFFF?text=IMG",
  });

  // Atualizar produtos quando o usuário mudar
  useEffect(() => {
    if (user?.restaurante) {
      // <--- MUDANÇA FUTURA: Aqui você fará uma requisição ao backend para buscar os produtos
      setProdutos(produtosPorRestaurante[user.restaurante] || []);
    }
  }, [user]);

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirModal = (produto = null) => {
    if (produto) {
      setProdutoEditando(produto);
      setFormData({
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco.toString(),
        disponivel: produto.disponivel,
        imagem: produto.imagem,
      });
    } else {
      setProdutoEditando(null);
      setFormData({
        nome: "",
        descricao: "",
        preco: "",
        disponivel: true,
        imagem: "https://via.placeholder.com/80x80/8B5CF6/FFFFFF?text=IMG",
      });
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setProdutoEditando(null);
  };

  const salvarProduto = () => {
    // <--- MUDANÇA FUTURA: Aqui você fará requisições POST/PUT ao backend para salvar/editar produtos
    if (produtoEditando) {
      // Editar produto existente
      setProdutos(
        produtos.map((p) =>
          p.id === produtoEditando.id
            ? { ...p, ...formData, preco: Number.parseFloat(formData.preco) }
            : p
        )
      );
    } else {
      // Adicionar novo produto
      const novoProduto = {
        id: Date.now(),
        ...formData,
        preco: Number.parseFloat(formData.preco),
      };
      setProdutos([...produtos, novoProduto]);
    }
    fecharModal();
  };

  const excluirProduto = (id) => {
    // <--- MUDANÇA FUTURA: Aqui você fará requisições DELETE ao backend para excluir produtos
    setProdutos(produtos.filter((p) => p.id !== id));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Gerenciar Cardápio</h1>
          {/* user.nomeRestaurante precisa ser populado no AuthContext/Backend ou traduzido aqui */}
          <p className="admin-subtitle">
            {user.restaurante || "N/A"} • {produtos.length} produtos{" "}
            {/* <--- MUDANÇA AQUI: user.restaurante */}
          </p>
          <p className="text-sm text-purple-600 mt-1">
            Logado como: {user.nome}
          </p>
        </div>
        <button
          onClick={() => abrirModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Adicionar Produto
        </button>
      </div>

      {/* Busca */}
      <div className="admin-search">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="admin-search-input"
        />
      </div>

      {/* Lista de Produtos */}
      <div className="admin-grid">
        {produtosFiltrados.map((produto) => (
          <div key={produto.id} className="card group">
            <div className="flex items-start gap-4">
              <img
                src={produto.imagem || "/placeholder.svg"}
                alt={produto.nome}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {produto.nome}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {produto.descricao}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-purple-600">
                    R$ {produto.preco.toFixed(2)}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      produto.disponivel
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {produto.disponivel ? "Disponível" : "Indisponível"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => abrirModal(produto)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => excluirProduto(produto.id)}
                className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {produtosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
        </div>
      )}

      {/* Modal é agora o componente ProdutoForm */}
      <ProdutoForm
        isOpen={modalAberto}
        onClose={fecharModal}
        formData={formData}
        setFormData={setFormData}
        onSave={salvarProduto}
        isEditing={!!produtoEditando}
      />
    </div>
  );
}
