import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import CreateGlobalStyle from "./globalStyle";
import { BodyContiner } from "./globalStyle";
function App() {
  return (
    <Router>
      <CreateGlobalStyle />
      <Navbar />
      <BodyContiner>
        <Switch>
          <Route to="/" component={Home} />
          <Route to="/home" component={Home} />
        </Switch>
      </BodyContiner>
    </Router>
  );
}

export default App;
