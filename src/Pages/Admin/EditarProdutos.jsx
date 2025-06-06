
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { Plus, Search, Edit, Trash2, X, Upload, Save } from "lucide-react";
import ProdutoForm from "../../Components/Admin/ProdutoForm";

// const produtosPorRestaurante = {...};

const API_BASE_URL = "http://localhost:3001";

export default function EditarProdutos() {
  const [searchParams] = useSearchParams();
  const { user, token, loading: authLoading } = useAuth();

  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [cardapioDoRestauranteId, setCardapioDoRestauranteId] = useState(null); // Estado para o cardapio_id

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    disponivel: true,
    imagem: "https://via.placeholder.com/80x80/8B5CF6/FFFFFF?text=IMG", // Placeholder padrão
  });

  const [pageLoading, setPageLoading] = useState(true); // Para gerenciar o carregamento da página

  // Efeito para buscar produtos e o ID do cardápio quando o usuário ou token mudar
  useEffect(() => {
    const fetchProdutosAndCardapio = async () => {
      // Se a autenticação ainda está carregando ou não há usuário/restaurante/token, apenas aguarde
      if (authLoading || !user || !user.restaurante || !token) {
        setPageLoading(false); // Garante que o loading seja falso se não houver user/token
        return;
      }

      setPageLoading(true); // Inicia o loading da página
      try {
        // 1. Primeiro, buscar o ID do cardápio principal do restaurante logado
        const responseCardapio = await fetch(
          `${API_BASE_URL}/api/cardapios/restaurante/${user.restaurante}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const dataCardapio = await responseCardapio.json();

        if (responseCardapio.ok && dataCardapio.success && dataCardapio.cardapios.length > 0) {
          // Assumimos que o primeiro cardápio encontrado é o principal para associar produtos
          const principalCardapioId = dataCardapio.cardapios[0].id;
          setCardapioDoRestauranteId(principalCardapioId);

          // 2. Em seguida, buscar os produtos associados a esse restaurante
          const responseProdutos = await fetch(
            `${API_BASE_URL}/api/produtos/${user.restaurante}${busca ? `?busca=${busca}` : ""}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const dataProdutos = await responseProdutos.json();

          if (responseProdutos.ok && dataProdutos.success) {
            setProdutos(dataProdutos.produtos);
          } else {
            console.error("Erro ao carregar produtos:", dataProdutos.message || "Erro desconhecido");
            setProdutos([]); // Limpa produtos em caso de erro
          }
        } else {
          console.warn("Nenhum cardápio encontrado para este restaurante ou erro ao buscar cardápio:", dataCardapio.message);
          setProdutos([]); // Limpa produtos se não houver cardápio
          setCardapioDoRestauranteId(null); // Define como nulo para desabilitar adição de produtos
        }
      } catch (error) {
        console.error("Erro geral ao buscar dados do cardápio/produtos:", error);
        setProdutos([]);
        setCardapioDoRestauranteId(null);
      } finally {
        setPageLoading(false); // Finaliza o loading da página
      }
    };

    fetchProdutosAndCardapio();
  }, [user, token, busca, authLoading]); // Dependências do useEffect

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
    // Para forçar a recarga dos produtos após fechar o modal
    setProdutos([]);
  };

  const salvarProduto = async () => {
    if (!cardapioDoRestauranteId) {
      alert("Não foi possível encontrar um cardápio para associar o produto. Certifique-se de que seu restaurante tem um cardápio cadastrado.");
      return;
    }

    const produtoParaSalvar = {
      ...formData,
      preco: Number.parseFloat(formData.preco),
      cardapio_id: cardapioDoRestauranteId, // Adiciona o cardapio_id necessário para o backend
    };

    try {
      let response;
      if (produtoEditando) {
        // Edição de produto existente
        response = await fetch(`${API_BASE_URL}/api/produtos/${produtoEditando.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Envia o token JWT
          },
          body: JSON.stringify(produtoParaSalvar),
        });
      } else {
        // Adição de novo produto
        response = await fetch(`${API_BASE_URL}/api/produtos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Envia o token JWT
          },
          body: JSON.stringify(produtoParaSalvar),
        });
      }

      const data = await response.json();

      if (response.ok && data.success) {
        alert(data.message);
        fecharModal();
        setProdutos([]); // Força o useEffect a recarregar a lista de produtos
      } else {
        alert(data.message || "Erro ao salvar produto.");
        console.error("Erro na resposta da API ao salvar produto:", data);
      }
    } catch (error) {
      alert("Erro de conexão ao salvar produto.");
      console.error("Erro de rede ao salvar produto:", error);
    }
  };

  const excluirProduto = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/produtos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Envia o token JWT
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(data.message);
        setProdutos(produtos.filter((p) => p.id !== id)); // Remove do estado local para atualização imediata
      } else {
        alert(data.message || "Erro ao excluir produto.");
        console.error("Erro na resposta da API ao excluir produto:", data);
      }
    } catch (error) {
      alert("Erro de conexão ao excluir produto.");
      console.error("Erro de rede ao excluir produto:", error);
    }
  };

  // Condição de carregamento unificada
  if (authLoading || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  // Se não houver usuário logado após o carregamento
  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Por favor, faça login para gerenciar produtos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Gerenciar Cardápio</h1>
          <p className="admin-subtitle">
            {user.restaurante || "N/A"} • {produtos.length} produtos{" "}
          </p>
          <p className="text-sm text-purple-600 mt-1">
            Logado como: {user.nome}
          </p>
        </div>
        <button
          onClick={() => abrirModal()}
          className="btn-primary flex items-center gap-2"
          disabled={!cardapioDoRestauranteId} // Desabilita o botão se não houver um cardapio_id
          title={!cardapioDoRestauranteId ? "Um cardápio deve ser criado para este restaurante antes de adicionar produtos." : ""}
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
        {produtos.map((produto) => ( // Use 'produtos' diretamente, pois agora vêm do backend
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
                    R$ {produto.preco ? produto.preco.toFixed(2) : '0.00'} {/* Adicionado .toFixed(2) e fallback */}
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

      {produtos.length === 0 && !pageLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum produto encontrado.</p>
          {!cardapioDoRestauranteId && (
            <p className="text-red-500 text-sm mt-2">Certifique-se de que seu restaurante possui um cardápio cadastrado no Supabase para poder adicionar produtos.</p>
          )}
        </div>
      )}

      {/* Modal é o componente ProdutoForm */}
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