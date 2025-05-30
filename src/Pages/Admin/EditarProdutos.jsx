"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useAuth } from "../../Context/AuthContext"
import { Plus, Search, Edit, Trash2, X, Upload, Save } from "lucide-react"

// Dados simulados dos produtos por restaurante
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
}

export default function EditarProdutos() {
  const [searchParams] = useSearchParams()
  const { user } = useAuth()

  // O restaurante sempre será o do usuário logado
  const restaurante = user?.restaurante || "mais1cafe"

  const [produtos, setProdutos] = useState(produtosPorRestaurante[restaurante] || [])
  const [busca, setBusca] = useState("")
  const [modalAberto, setModalAberto] = useState(false)
  const [produtoEditando, setProdutoEditando] = useState(null)
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    disponivel: true,
    imagem: "https://via.placeholder.com/80x80/8B5CF6/FFFFFF?text=IMG",
  })

  // Atualizar produtos quando o usuário mudar
  useEffect(() => {
    if (user?.restaurante) {
      setProdutos(produtosPorRestaurante[user.restaurante] || [])
    }
  }, [user])

  const produtosFiltrados = produtos.filter((produto) => produto.nome.toLowerCase().includes(busca.toLowerCase()))

  const abrirModal = (produto = null) => {
    if (produto) {
      setProdutoEditando(produto)
      setFormData({
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco.toString(),
        disponivel: produto.disponivel,
        imagem: produto.imagem,
      })
    } else {
      setProdutoEditando(null)
      setFormData({
        nome: "",
        descricao: "",
        preco: "",
        disponivel: true,
        imagem: "https://via.placeholder.com/80x80/8B5CF6/FFFFFF?text=IMG",
      })
    }
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setProdutoEditando(null)
  }

  const salvarProduto = () => {
    if (produtoEditando) {
      // Editar produto existente
      setProdutos(
        produtos.map((p) =>
          p.id === produtoEditando.id ? { ...p, ...formData, preco: Number.parseFloat(formData.preco) } : p,
        ),
      )
    } else {
      // Adicionar novo produto
      const novoProduto = {
        id: Date.now(),
        ...formData,
        preco: Number.parseFloat(formData.preco),
      }
      setProdutos([...produtos, novoProduto])
    }
    fecharModal()
  }

  const excluirProduto = (id) => {
    setProdutos(produtos.filter((p) => p.id !== id))
  }

  if (!user) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Gerenciar Cardápio</h1>
          <p className="admin-subtitle">
            {user.nomeRestaurante} • {produtos.length} produtos
          </p>
          <p className="text-sm text-purple-600 mt-1">Logado como: {user.nome}</p>
        </div>
        <button onClick={() => abrirModal()} className="btn-primary flex items-center gap-2">
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
                <h3 className="font-semibold text-gray-900 truncate">{produto.nome}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{produto.descricao}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-purple-600">R$ {produto.preco.toFixed(2)}</span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      produto.disponivel ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {produtoEditando ? "Editar Produto" : "Adicionar Produto"}
              </h2>
              <button onClick={fecharModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Produto</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: Café Expresso"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Descreva o produto..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0,00"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="disponivel"
                  checked={formData.disponivel}
                  onChange={(e) => setFormData({ ...formData, disponivel: e.target.checked })}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="disponivel" className="text-sm font-medium text-gray-700">
                  Produto disponível
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Produto</label>
                <div className="flex items-center gap-4">
                  <img
                    src={formData.imagem || "/placeholder.svg"}
                    alt="Preview"
                    className="w-15 h-15 rounded-lg object-cover"
                  />
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Upload className="w-4 h-4" />
                    Alterar Imagem
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <button onClick={fecharModal} className="btn-secondary flex-1">
                Cancelar
              </button>
              <button onClick={salvarProduto} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
