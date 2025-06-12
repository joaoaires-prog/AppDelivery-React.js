// src/Components/Apetits.jsx

import React, { useState, useEffect } from 'react';
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import Button from "../Layouts/Button";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

const API_BASE_URL = "http://localhost:3001";

export default function Apetits() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const RESTAURANTE_ID = 2; // ID para Apetits

  const whatsappNumbers = {
    1: "5561987654321", // PicaPau (ID 1)
    2: "5561912345678", // Apetits (ID 2)
    3: "5561998765432", // Mais1Café (ID 3)
  };

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

  const handleOrderClick = (produto) => {
    const whatsappNum = whatsappNumbers[RESTAURANTE_ID];
    if (!whatsappNum) {
      alert("Número de WhatsApp não configurado para este restaurante.");
      return;
    }
    const message = encodeURIComponent(
      `Olá, gostaria de encomendar o produto: ${produto.nome} (R$ ${produto.preco ? produto.preco.toFixed(2) : '0.00'}). Meu nome é [SEU NOME].`
    );
    window.open(`https://wa.me/${whatsappNum}?text=${message}`, '_blank');
  };


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center lg:px-32 px-5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando cardápio do Apetits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center lg:px-32 px-5 text-red-600">
        <p>Erro ao carregar cardápio do Apetits: {error}</p>
        <p className="text-gray-500 text-sm mt-2">Verifique sua conexão ou tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className=" min-h-screen flex flex-col justify-center items-center lg:px-32 px-5">
      <h1 className=" text-4xl font-semibold text-center pt-24 pb-10">
        Apetits
      </h1>

      {produtos.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>Nenhum item disponível neste cardápio no momento.</p>
        </div>
      ) : (
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          loop={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 50,
            },
          }}
          className="mySwiper w-full max-w-7xl pb-10"
        >
          {produtos.map((produto) => (
            <SwiperSlide key={produto.id}>
              <div
                className="
                  w-full
                  p-5 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-lg
                  flex flex-col h-full
                  justify-between
                "
              >
                <img
                  className="rounded-xl w-full h-48 object-cover mb-4"
                  src={produto.imagem || "/placeholder.svg"}
                  alt={produto.nome}
                />
                <div className="space-y-2 flex-grow flex flex-col justify-between">
                  <div>
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
                  <div className="flex flex-col items-center justify-center gap-2 mt-auto">
                    <h3 className="font-semibold text-lg">
                      R$ {produto.preco ? produto.preco.toFixed(2) : '0.00'}
                    </h3>
                    {produto.disponivel ? (
                        <Button
                          title="Encomendar agora"
                          onClick={() => handleOrderClick(produto)}
                        />
                    ) : (
                        <span className="text-red-500 text-sm text-center">Indisponível</span>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}