import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Home />
      </main>

      <Footer />
    </>
  );
}

export default App;