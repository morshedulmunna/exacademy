import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import CreateGlobalStyle from "./globalStyle";

function App() {
  return (
    <div>
      <Router>
        <CreateGlobalStyle />
        <Navbar />
      </Router>
    </div>
  );
}

export default App;
