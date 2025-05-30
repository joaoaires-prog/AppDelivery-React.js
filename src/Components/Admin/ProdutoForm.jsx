"use client"

import { X, Upload, Save } from "lucide-react"

export default function ProdutoForm({ isOpen, onClose, formData, setFormData, onSave, isEditing }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">{isEditing ? "Editar Produto" : "Adicionar Produto"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
          <button onClick={onClose} className="flex-1 btn-secondary">
            Cancelar
          </button>
          <button onClick={onSave} className="flex-1 btn-primary flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
