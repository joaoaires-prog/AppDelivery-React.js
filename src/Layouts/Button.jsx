// src/Layouts/Button.jsx

const Button = (props) => {
  // Use a desestruturação para pegar o 'title' e o 'onClick' (e outras props)
  const { title, onClick, ...restProps } = props; // <<<< MUDANÇA AQUI: Captura onClick e outras props

  return (
    <div>
      {/* <<<< MUDANÇA AQUI: Adiciona o onClick e repassa o restProps */}
      <button
        className="px-6 py-1 border-2 border-purple-600 text-slate-950 bg-purple-400 hover:bg-purple-600 hover:text-white transition-all rounded-full"
        onClick={onClick} // Repassa o onClick para o botão nativo
        {...restProps} // Repassa quaisquer outras props (como disabled, type, etc.)
      >
        {title}
      </button>
    </div>
  );
};

export default Button;