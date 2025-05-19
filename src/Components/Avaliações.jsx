import AvaliaçõesCard from "../Layouts/AvaliaçõesCard";
import imgl from "../assets/imgApp/tiadong.png";

const Avaliações = () => {
  return (
    <div className=" min-h-screen flex flex-col items-center justify-center md:px-32 px-5">
      <h1 className=" text-4xl font-semibold text-center lg:pt-16 pt-24 pb-10">
        Avalições dos Usuários
      </h1>

      <div className=" flex flex-col md:flex-row gap-5 mt-5">
        <AvaliaçõesCard img={imgl} name="Tia do NG Life" />
      </div>
    </div>
  );
};

export default Avaliações;
