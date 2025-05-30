"use client"

import { Edit, Trash2 } from "lucide-react"

export default function ProdutoCard({ produto, onEdit, onDelete }) {
  return (
    <div className="card group">
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
          onClick={() => onEdit(produto)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Editar
        </button>
        <button
          onClick={() => onDelete(produto.id)}
          className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
