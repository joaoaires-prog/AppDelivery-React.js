import React from 'react';

const AvaliaçõesCard = ({ avaliacao }) => {
  // Função para renderizar estrelas baseada na nota
  const renderStars = (nota) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-lg ${i <= nota ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Função para formatar data
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Gerar avatar com iniciais se não houver imagem
  const gerarAvatar = (nome) => {
    const iniciais = nome
      .split(' ')
      .map(palavra => palavra.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
    
    return iniciais;
  };

  // Cores de fundo aleatórias para avatares
  const coresAvatar = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
    'bg-pink-500', 'bg-indigo-500', 'bg-yellow-500'
  ];
  
  const corAvatar = coresAvatar[avaliacao.nome_usuario.length % coresAvatar.length];

  return (
    <div className="w-full bg-white border-2 border-lightText md:border-none p-5 rounded-lg shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] hover:shadow-lg transition-shadow">
      {/* Avaliação por Estrelas */}
      <div className="flex justify-center mb-3">
        {renderStars(avaliacao.nota)}
      </div>

      {/* Texto da Avaliação */}
      <div className="mb-4">
        <p className="text-lightText text-sm leading-relaxed">
          "{avaliacao.texto}"
        </p>
      </div>

      {/* Informações do Usuário */}
      <div className="flex flex-row justify-center items-center gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {avaliacao.imagem_perfil ? (
            <img
              className="rounded-full w-12 h-12 object-cover"
              src={avaliacao.imagem_perfil}
              alt={`Avatar de ${avaliacao.nome_usuario}`}
              onError={(e) => {
                // Fallback para avatar com iniciais se imagem não carregar
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          
          {/* Avatar com iniciais (sempre presente como fallback) */}
          <div
            className={`rounded-full w-12 h-12 ${corAvatar} ${
              avaliacao.imagem_perfil ? 'hidden' : 'flex'
            } items-center justify-center text-white font-bold text-sm`}
            style={{ display: avaliacao.imagem_perfil ? 'none' : 'flex' }}
          >
            {gerarAvatar(avaliacao.nome_usuario)}
          </div>
        </div>

        {/* Nome e Data */}
        <div className="text-center">
          <h3 className="font-semibold text-gray-800 mb-1">
            {avaliacao.nome_usuario}
          </h3>
          <p className="text-xs text-gray-500">
            {formatarData(avaliacao.data_criacao)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvaliaçõesCard;