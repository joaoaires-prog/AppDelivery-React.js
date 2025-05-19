import PratosCard from "../Layouts/PicaPauCard";
import img1 from "../assets/imgPicapau/crepe-frango-e-milho.png";
import img2 from "../assets/imgPicapau/crepe-mms.png";
import img3 from "../assets/imgPicapau/crepe-nutella.png";

const PicaPau = () => {
  return (
    <div>
        <h1 className=" text-4xl font-semibold text-center pt-24 pb-10">
        Pica Pau Crepes
      </h1>

      <div className=" flex flex-wrap gap-8 justify-center">
        <PratosCard img={img1} title="Crepe de Frango E Milho" price="R$18,99" />
        <PratosCard img={img2} title="Crepe de MM's" price="R$21,99" />
        <PratosCard img={img3} title="Crepe de Nutella" price="R$23,99" />
      </div>
    </div>
  )
}

export default PicaPau;
