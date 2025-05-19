const Footer = () => {
  return (
    <div className="bg-purple-400 text-white rounded-t-3xl mt-8 md:mt-0">
      <div className="flex flex-col md:flex-row justify-between p-8 md:px-32 px-5 gap-8">
        <div className="w-full md:w-1/4">
          <h1 className="font-semibold text-xl pb-4">CeubMenu</h1>
          <p className="text-sm">
            O CeubMenu chegou pra facilitar sua vida na hora de escolher onde
            comer no CEUB. Tudo num só lugar, sem complicação. Bora matar a fome
            do jeito certo! 🍽️
          </p>
        </div>
        <div>
          <h1 className=" font-medium text-xl pb-4 pt-5 md:pt-0">Links</h1>
          <nav className=" flex flex-col gap-4">
            <a
              className="hover:text-purple-600 transition-all cursor-pointer"
              href="/"
            >
              Mais1Café
            </a>
            <a
              className="hover:text-purple-600 transition-all cursor-pointer"
              href="/"
            >
              Apetit's
            </a>
            <a
              className="hover:text-purple-600 transition-all cursor-pointer"
              href="/"
            >
              Pica Pau
            </a>
          </nav>
        </div>

        <div>
          <h1 className=" font-medium text-xl pb-4 pt-5 md:pt-0">
            Nosso Contato
          </h1>
          <nav className=" flex flex-col gap-4">
            <a
              className="hover:text-purple-600 transition-all cursor-pointer"
              href="/"
            >
              📧 E-mail de contato: ceubmenu@exemplo.com
            </a>
            <a
              className="hover:text-purple-600 transition-all cursor-pointer"
              href="/"
            >
              📞 Telefone: (61) 4002-8922
            </a>
            <a
              className="hover:text-purple-600 transition-all cursor-pointer"
              href="/"
            >
              🌐 Redes Sociais
            </a>
          </nav>
        </div>

        <div>
          <p className=" text-center py-4">
            © 2025 CeubMenu — Cardápios do CEUB com praticidade e transparência
            | All rights reserved to
            <span className=" text-black">
              {" "}
              João Victor Aires, Nicolas Clay, Gabriel Bahia developers
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
