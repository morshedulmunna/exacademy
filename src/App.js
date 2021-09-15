import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import CreateGlobalStyle from "./globalStyle";
import Home from "./pages/HomePage/Home.js";

function App() {
  return (
    <Router>
      <CreateGlobalStyle />
      <Navbar />
      <Switch>
        <Route path="/home" exact component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
