import PratosCard from "../Layouts/ApetitsCard";
import img1 from "../assets/imgApetits/franguinho-bravo.jpg";
import img2 from "../assets/imgApetits/franguinho-jr.jpg";
import img3 from "../assets/imgApetits/franguinho-picante.jpg";

const Apetits = () => {
  return (
    <div className=" min-h-screen flex flex-col justify-center items-center lg:px-32 px-5">
      <h1 className=" text-4xl font-semibold text-center pt-24 pb-10">
        Apetit's
      </h1>

      <div className=" flex flex-wrap gap-8 justify-center">
        <PratosCard img={img1} title="Franguinho Bravo" price="R$11,99" />
        <PratosCard img={img2} title="Franguinho Jr" price="R$11,99" />
        <PratosCard img={img3} title="Franguinho Picante" price="R$11,99" />
      </div>
    </div>
  );
};

export default Apetits;
