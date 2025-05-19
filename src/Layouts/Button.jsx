const Button = (props) => {
  return (
    <div>
      <button className="px-6 py-1 border-2 border-purple-600 text-slate-950 bg-purple-400 hover:bg-purple-600 hover:text-white transition-all rounded-full">
        {props.title}
      </button>
    </div>
  );
};

export default Button;
