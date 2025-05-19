import PratosCard from "../Layouts/Mais1CafeCard";
import img1 from "../assets/imgMais1cafe/pao-de-queijo.jpg";
import img2 from "../assets/imgMais1cafe/croissant.jpg";
import img3 from "../assets/imgMais1cafe/vanilla-mais-cafe.png";

const Mais1Cafe = () => {
  return (
    <div className=" min-h-screen flex flex-col justify-center items-center lg:px-32 px-5">
      <h1 className=" text-4xl font-semibold text-center pt-24 pb-10">
        Mais1Café
      </h1>

      <div className=" flex flex-wrap gap-8 justify-center">
        <PratosCard img={img1} title="Pão de Queijo" price="R$14,99" />
        <PratosCard img={img2} title="Croissant" price="R$18,99" />
        <PratosCard img={img3} title="Coffee Vanilla" price="R$11,99" />
      </div>
    </div>
  );
};

export default Mais1Cafe;
