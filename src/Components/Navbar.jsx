import { BiRestaurant } from "react-icons/bi";
import { Link } from "react-scroll";
import Button from "../Layouts/Button";
import { AiOutlineClose, AiOutlineMenuFold } from "react-icons/ai";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom"; 

const Navbar = () => {
  const [menu, setMenu] = useState(false);

  const handleChange = () => {
    setMenu(!menu);
  };

  const closeMenu = () => {
    setMenu(false);
  };

  return (
    <div className="fixed w-full z-50">
      <div>
        <div className="flex flex-row justify-between p-5 md:px-32 px-5 bg-white shadow-[0_3px_10px_rgba(0,0,0,0.2)]">
          <div className="flex flex-row items-center cursor-pointer">
            <span>
              <BiRestaurant size={32} />
            </span>
            <h1 className="text-xl font-semibold">CeubMenu</h1>
          </div>

          <nav className="hidden md:flex flex-row items-center text-lg font-medium gap-8">
            <Link
              to="inicio"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-purple-600 transition-all cursor-pointer"
            >
              Início
            </Link>

            <Link
              to="mais1cafe"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-purple-600 transition-all cursor-pointer"
            >
              Mais1Café
            </Link>

            <Link
              to="apetits"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-purple-600 transition-all cursor-pointer"
            >
              Apetit's
            </Link>

            <Link
              to="picapau"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-purple-600 transition-all cursor-pointer"
            >
              Pica Pau
            </Link>

            <Link
              to="sobre"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-purple-600 transition-all cursor-pointer"
            >
              Sobre
            </Link>

            <Link
              to="avaliacoes"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-purple-600 transition-all cursor-pointer"
            >
              Avaliações
            </Link>

            <RouterLink to="/login">
              <Button title="Login" />
            </RouterLink>
          </nav>

          <div className="md:hidden flex items-center">
            {menu ? (
              <AiOutlineClose size={25} onClick={handleChange} />
            ) : (
              <AiOutlineMenuFold size={25} onClick={handleChange} />
            )}
          </div>
        </div>

        <div
          className={`${
            menu ? "translate-x-0" : "-translate-x-full"
          } md:hidden flex flex-col absolute bg-violet-600 text-white left-0 top-20 font-semibold text-2xl text-center pt-8 pb-4 gap-8 w-full h-fit transition-transform duration-300`}
        >
          <Link
            to="inicio"
            spy={true}
            smooth={true}
            duration={500}
            onClick={closeMenu}
          >
            Início
          </Link>
          <Link
            to="mais1cafe"
            spy={true}
            smooth={true}
            duration={500}
            onClick={closeMenu}
          >
            Mais1Café
          </Link>
          <Link
            to="apetits"
            spy={true}
            smooth={true}
            duration={500}
            onClick={closeMenu}
          >
            Apetit's
          </Link>
          <Link
            to="picapau"
            spy={true}
            smooth={true}
            duration={500}
            onClick={closeMenu}
          >
            Pica Pau
          </Link>
          <Link
            to="sobre"
            spy={true}
            smooth={true}
            duration={500}
            onClick={closeMenu}
          >
            Sobre
          </Link>
          <Link
            to="avaliacoes"
            spy={true}
            smooth={true}
            duration={500}
            onClick={closeMenu}
          >
            Avaliações
          </Link>

          <RouterLink to="/login">
            <Button title="Login" />
          </RouterLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
