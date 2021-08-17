import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {createGlobalStyle} from "styled-components";
import './App.css';
import Auth from "./components/Auth/Auth";
import Authenticated from "./components/Authenticated";
import NavBar from "./components/Navbar/Navbar";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
    return (
        <div className="App">
            <Router>
                <GlobalStyle/>
                <NavBar/>
                <Switch>
                    <PrivateRoute path="/" exact component={Authenticated}/>
                    <Route path="/login" exact component={Auth}/>
                </Switch>
            </Router>
        </div>
    );
}

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: #444;
    font-family: Roboto, "helvetica neue", sans-serif;
  }

  a, a:visited, a:focus, a:hover {
    text-decoration: none;
    color: white;
  }

  .MuiTypography-h6 {
    a, a:visited, a:focus, a:hover {
      color: white;
    }
  }
`;

