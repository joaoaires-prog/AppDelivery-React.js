import Button from "../Layouts/Button";

const Home = () => {
  return (
    <div className=" min-h-screen flex flex-row justify-between items-center lg:px-32 px-5 bg-[url('./assets/imgApp/fundo-login.png')] bg-cover bg-no-repeat ">
      <div className=" w-full lg:w-2/3 space-y-5">
        <h1 className="text-white font-semibold text-6xl">
          CeubMenu: seu cardápio CEUB, sempre à mão.
        </h1>
        <p className="text-white">
          O sistema de cardápio do CEUB permite que usuários consultem, de forma
          prática e rápida, as refeições disponíveis nos restaurantes da
          instituição, com informações sobre ingredientes, nutrição e
          alergênicos.
        </p>
        <div>
          <Button title="Escolha e Encomende sua comida já" />
        </div>
      </div>
    </div>
  );
};

export default Home;
