import Navbar from "./Components/Navbar";
import Ínicio from "./Components/Ínicio";
import Mais1cafe from "./Components/Mais1Cafe";
import Apetits from "./Components/Apetits";
import PicaPau from "./Components/PicaPau";
import Sobre from "./Components/Sobre";
import Avalições from "./Components/Avaliações";
import Footer from "./Components/Footer";

const App = () => {
  return (
    <div>
      <Navbar />
      <main>
        <div id="inicio">
          <Ínicio />
        </div>

        <div id="mais1cafe">
          <Mais1cafe />
        </div>

        <div id="apetits">
          <Apetits />
        </div>

        <div id="picapau">
          <PicaPau />
        </div>

        <div id="sobre">
          <Sobre />
        </div>

        <div id="avaliacoes">
          <Avalições />
        </div>

        <div>
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default App;
