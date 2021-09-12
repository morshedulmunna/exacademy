import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Header from "./components/Header/Header";
import CreateGlobalStyle from "./globalStyle";

function App() {
  return (
    <div>
      <Router>
        <CreateGlobalStyle />
        <Navbar />
        <Header></Header>
      </Router>
    </div>
  );
}

export default App;
