import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import Navbar from "./components/Navbar";
import Home from "./Home";
import About from "./About";
import Services from "./Services";
import Contact from "./Contact";
//import Footer from "./components/Footer"; // optional

function App() {
  const appStyle = {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  };

  return (
    <div style={appStyle}>
      <Router>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        
      </Router>
    </div>
  );
}

export default App;
