// src/Components/Admin/ProdutoForm.jsx

"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Save } from "lucide-react";


export default function ProdutoForm({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSave,
  isEditing,
}) {
  const [imageFilePreview, setImageFilePreview] = useState(null);


  useEffect(() => {
    if (!isOpen) {
      setImageFilePreview(null);
    } else {
        if (formData.imagem instanceof File) {
            setImageFilePreview(URL.createObjectURL(formData.imagem));
        } else {
            setImageFilePreview(null);
        }
    }
  }, [isOpen, formData.imagem]);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'file') return;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({ ...prevData, imagem: file }));
      setImageFilePreview(URL.createObjectURL(file));
    } else {
      setFormData((prevData) => ({ ...prevData, imagem: isEditing ? prevData.imagem : null }));
      setImageFilePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave();
  };

  if (!isOpen) return null;

  const displayImageSrc = imageFilePreview || (typeof formData.imagem === 'string' ? formData.imagem : "/placeholder.svg");


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? "Editar Produto" : "Adicionar Produto"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
              Nome do Produto
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
            ></textarea>
          </div>
          <div>
            <label htmlFor="preco" className="block text-sm font-medium text-gray-700">
              Preço (R$)
            </label>
            <input
              type="number"
              id="preco"
              name="preco"
              value={formData.preco}
              onChange={handleInputChange}
              required
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="disponivel"
              name="disponivel"
              checked={formData.disponivel}
              onChange={handleInputChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="disponivel" className="ml-2 block text-sm text-gray-900">
              Disponível
            </label>
          </div>

          {/* Campo de Upload de Imagem */}
          <div>
            <label htmlFor="imagemUpload" className="block text-sm font-medium text-gray-700">
              Imagem do Produto
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                id="imagemUpload"
                name="imagem"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:text-sm file:font-semibold
                           file:bg-purple-50 file:text-purple-700
                           hover:file:bg-purple-100"
              />
              {/* Exibir imagem prévia */}
              {displayImageSrc && (
                <img
                  src={displayImageSrc}
                  alt="Prévia"
                  className="w-20 h-20 rounded-lg object-cover"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              <X className="w-5 h-5 mr-2" /> Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              <Save className="w-5 h-5 mr-2" /> {isEditing ? "Salvar Alterações" : "Adicionar Produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}