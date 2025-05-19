const AvaliaçõesCard = (props) => {
  return (
    <div className=" w-full md:w-1/3 bg-white border-2 border-lightText md: border-none p-5 rounded-lg shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
      <div>
        <p className="text-lightText">
          Uso o CeubMenu quase todos os dias para conferir o cardápio da
          faculdade, e a opção do Mais1Café é, sem dúvida, uma das minhas
          preferidas. Os produtos são sempre frescos e bem preparados. Meus
          favoritos são o pão de queijo quentinho e o croissant de chocolate,
          impossível resistir!
        </p>
      </div>

      <div className=" flex flex-row justify-center items-center mt-4 gap-4">
        <img className=" rounded-full w-1/4" src={props.img} alt="img" />
        <h3 className=" font-semibold">{props.name}</h3>
      </div>
    </div>
  );
};

export default AvaliaçõesCard;
