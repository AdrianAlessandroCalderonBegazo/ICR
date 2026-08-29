import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import RequestQuote from "./pages/RequestQuote";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/soluciones" element={<Services />} />
          <Route path="/solicitar-asesoria" element={<RequestQuote />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;