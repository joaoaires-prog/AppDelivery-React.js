import React, { useState } from 'react';

// 'restauranteId' removido das props
const AvaliacaoForm = ({ onAvaliacaoEnviada }) => { 
  const [formData, setFormData] = useState({
    texto: '',
    nota: 5,
    nome_usuario: ''
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar mensagens ao digitar
    if (erro) setErro('');
    if (sucesso) setSucesso('');
  };

  const handleStarClick = (nota) => {
    setFormData(prev => ({
      ...prev,
      nota
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    setSucesso('');

    try {
      // 'restaurante_id' removido dos dados para envio
      const dadosParaEnvio = {
        ...formData, 
      };

      const response = await fetch('/api/avaliacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosParaEnvio)
      });

      const data = await response.json();

      if (data.success) {
        setSucesso('Avaliação enviada com sucesso!');
        setFormData({
          texto: '',
          nota: 5,
          nome_usuario: ''
        });
        
        // Callback para atualizar lista de avaliações
        if (onAvaliacaoEnviada) {
          onAvaliacaoEnviada(data.avaliacao);
        }
      } else {
        setErro(data.message || 'Erro ao enviar avaliação.');
      }
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      setErro('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => handleStarClick(star)}
        className={`text-2xl ${
          star <= formData.nota ? 'text-yellow-400' : 'text-gray-300'
        } hover:text-yellow-400 transition-colors`}
      >
        ★
      </button>
    ));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-100 max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-center">
        Deixe sua Avaliação
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Nome */}
        <div>
          <label htmlFor="nome_usuario" className="block text-sm font-medium text-gray-700 mb-1">
            Seu Nome
          </label>
          <input
            type="text"
            id="nome_usuario"
            name="nome_usuario"
            value={formData.nome_usuario}
            onChange={handleChange}
            required
            maxLength="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite seu nome"
          />
        </div>

        {/* Avaliação por Estrelas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sua Nota
          </label>
          <div className="flex justify-center space-x-1 mb-2">
            {renderStars()}
          </div>
          <p className="text-sm text-gray-600 text-center">
            {formData.nota} de 5 estrelas
          </p>
        </div>

        {/* Campo Texto */}
        <div>
          <label htmlFor="texto" className="block text-sm font-medium text-gray-700 mb-1">
            Sua Avaliação
          </label>
          <textarea
            id="texto"
            name="texto"
            value={formData.texto}
            onChange={handleChange}
            required
            minLength="10"
            maxLength="500"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Conte-nos sobre sua experiência... (mínimo 10 caracteres)"
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.texto.length}/500 caracteres
          </div>
        </div>

        {/* Mensagens de Erro/Sucesso */}
        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {sucesso}
          </div>
        )}

        {/* Botão Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {loading ? 'Enviando...' : 'Enviar Avaliação'}
        </button>
      </form>
    </div>
  );
};

export default AvaliacaoForm;