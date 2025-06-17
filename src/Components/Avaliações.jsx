import React, { useState, useEffect } from 'react';
import AvaliaçõesCard from "../Layouts/AvaliaçõesCard";
import AvaliacaoForm from "./AvaliaçõesForm";

const Avaliações = () => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [estatisticas, setEstatisticas] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Função para buscar avaliações
  const buscarAvaliacoes = async (pagina = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/avaliacoes?pagina=${pagina}&limite=6`);
      const data = await response.json();

      if (data.success) {
        setAvaliacoes(data.avaliacoes);
        setTotalPaginas(data.totalPaginas);
        setPaginaAtual(data.pagina);
      } else {
        setErro('Erro ao carregar avaliações.');
      }
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      setErro('Erro de conexão ao carregar avaliações.');
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar estatísticas
  const buscarEstatisticas = async () => {
    try {
      const response = await fetch('/api/avaliacoes/estatisticas');
      const data = await response.json();

      if (data.success) {
        setEstatisticas(data.estatisticas);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  // Carregar dados inicial
  useEffect(() => {
    buscarAvaliacoes();
    buscarEstatisticas();
  }, []);

  // Callback quando nova avaliação é enviada
  const handleNovaAvaliacao = (novaAvaliacao) => {
    setAvaliacoes(prev => [novaAvaliacao, ...prev]);
    buscarEstatisticas(); // Atualizar estatísticas
  };

  // Função para mudar página
  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      buscarAvaliacoes(novaPagina);
    }
  };

  const renderStarsMedia = (media) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-lg ${i <= Math.round(media) ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center md:px-32 px-5">
      <h1 className="text-4xl font-semibold text-center lg:pt-16 pt-24 pb-10">
        Avaliações dos Usuários
      </h1>

      {/* Estatísticas */}
      {estatisticas && estatisticas.total > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-100 mb-8 text-center">
          <div className="flex items-center justify-center space-x-4">
            <div>
              <p className="text-3xl font-bold text-blue-600">{estatisticas.mediaNotas}</p>
              <div className="flex justify-center">
                {renderStarsMedia(estatisticas.mediaNotas)}
              </div>
            </div>
            <div className="text-left">
              <p className="text-gray-600">Baseado em</p>
              <p className="text-xl font-semibold">{estatisticas.total} avaliações</p>
            </div>
          </div>
        </div>
      )}

      {/* Formulário de Nova Avaliação */}
      <div className="mb-10 w-full max-w-md">
        <AvaliacaoForm onAvaliacaoEnviada={handleNovaAvaliacao} />
      </div>

      {/* Lista de Avaliações */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">Carregando avaliações...</p>
        </div>
      ) : erro ? (
        <div className="text-center py-8">
          <p className="text-lg text-red-600">{erro}</p>
          <button
            onClick={() => buscarAvaliacoes()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Tentar Novamente
          </button>
        </div>
      ) : avaliacoes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">
            Ainda não há avaliações. Seja o primeiro a avaliar!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 w-full">
            {avaliacoes.map((avaliacao) => (
              <AvaliaçõesCard
                key={avaliacao.id}
                avaliacao={avaliacao}
              />
            ))}
          </div>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => mudarPagina(paginaAtual - 1)}
                disabled={paginaAtual === 1}
                className={`px-4 py-2 rounded ${
                  paginaAtual === 1
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                Anterior
              </button>
              
              <span className="text-gray-600">
                Página {paginaAtual} de {totalPaginas}
              </span>
              
              <button
                onClick={() => mudarPagina(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
                className={`px-4 py-2 rounded ${
                  paginaAtual === totalPaginas
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Avaliações;