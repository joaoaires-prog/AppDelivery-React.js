import React, { useState, useEffect } from 'react';
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import Button from "../Layouts/Button";

const API_BASE_URL = "http://localhost:3001";

export default function Mais1cafe() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const RESTAURANTE_ID = 1; // Ajuste para o ID correto de cada componente

  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/public/cardapio/${RESTAURANTE_ID}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setProdutos(data.produtos);
        } else {
          setError(data.message || "Erro ao carregar cardápio.");
          console.error("Erro ao carregar cardápio público:", data);
        }
      } catch (err) {
        setError("Não foi possível conectar ao servidor para carregar o cardápio.");
        console.error("Erro de rede ao carregar cardápio público:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [RESTAURANTE_ID]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center lg:px-32 px-5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando cardápio do PicaPau...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center lg:px-32 px-5 text-red-600">
        <p>Erro ao carregar cardápio do PicaPau: {error}</p>
        <p className="text-gray-500 text-sm mt-2">Verifique sua conexão ou tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className=" min-h-screen flex flex-col justify-center items-center lg:px-32 px-5">
      <h1 className=" text-4xl font-semibold text-center pt-24 pb-10">
        PicaPau
      </h1>

      {produtos.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>Nenhum item disponível neste cardápio no momento.</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {produtos.map((produto) => (
            // Card individual do produto
            <div
              key={produto.id}
              className="
                w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5
                max-w-xs /* Mantém uma largura máxima razoável */
                p-5 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-lg
                flex flex-col /* IMPORTANTE: Transforma o card em um contêiner flexível de coluna */
              "
            >
              <img
                className="rounded-xl w-full h-48 object-cover mb-4"
                src={produto.imagem || "/placeholder.svg"}
                alt={produto.nome}
              />
              <div className="space-y-2 flex-grow flex flex-col justify-between"> {/* Flex-grow para ocupar espaço e justify-between para alinhar conteúdo verticalmente */}
                <div> {/* Contêiner para título, descrição e estrelas */}
                  <h3 className="font-semibold text-center text-xl">
                    {produto.nome}
                  </h3>
                  <p className="text-center text-gray-600 text-sm mb-2 line-clamp-2">
                    {produto.descricao}
                  </p>
                  <div className="flex flex-row justify-center">
                    <BsStarFill className="text-purple-600" />
                    <BsStarFill className="text-purple-600" />
                    <BsStarFill className="text-purple-600" />
                    <BsStarFill className="text-purple-600" />
                    <BsStarHalf />
                  </div>
                </div>
                {/* Preço e botão alinhados ao final */}
                <div className="flex flex-col items-center justify-center gap-2 mt-auto"> {/* mt-auto empurra para o final */}
                  <h3 className="font-semibold text-lg">
                    R$ {produto.preco ? produto.preco.toFixed(2) : '0.00'}
                  </h3>
                  {produto.disponivel ? (
                      <Button title="Encomendar agora" />
                  ) : (
                      <span className="text-red-500 text-sm text-center">Indisponível</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}