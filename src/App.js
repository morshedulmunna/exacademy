import { Routes, Route } from "react-router-dom";
import About from "./Route/About.js";
import Home from "./Route/Home.js";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;
