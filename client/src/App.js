import {createGlobalStyle} from "styled-components";
import './App.css';
import Auth from "./components/Auth/Auth";
import {useSelector} from "react-redux";
import {Paper} from "@material-ui/core";

export default function App() {
    const user = useSelector(state => state.auth);
    console.log(user);
    return (
        <div className="App">
            <GlobalStyle/>
            {user?.email ? <Auth/> : <Paper><h2>Authenticated</h2></Paper>}
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

