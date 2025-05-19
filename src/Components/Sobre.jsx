import img from "../assets/imgApp/moscoteceubmenu.png";
import Button from "../Layouts/Button";

const Sobre = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row justify-center items-center lg:px-32 px-5 gap-10">
      
      <img src={img} alt="img" className="w-full max-w-md" />

      
      <div className="space-y-4 max-w-xl">
        <h1 className="font-semibold text-4xl text-center lg:text-start">
          Por que o CeubMenu é a melhor escolha?
        </h1>

        <p>
          Oferecemos uma solução simples e acessível para visualizar, de forma
          prática, o cardápio dos restaurantes do CEUB. Com interface intuitiva e
          responsiva, o CeubMenu facilita a escolha das refeições com informações
          claras sobre ingredientes, nutrição e alergênicos.
        </p>

        <p>
          Feito para estudantes, professores e colaboradores do CEUB, o CeubMenu
          reúne os cardápios atualizados em um só lugar, facilitando o
          planejamento das refeições com transparência, praticidade e na palma da
          mão.
        </p>

        {/*<div>
          <Button title="Saiba Mais" />
        </div>*/}
        
      </div>
    </div>
  );
};

export default Sobre;



