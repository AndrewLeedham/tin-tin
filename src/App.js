import React from "react";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import { customTheme } from "./theme";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Session from "./screens/Session";
import Team from "./screens/Team";

function App() {
  return (
    <Router>
      <ThemeProvider theme={customTheme}>
        <CSSReset />
        <Switch>
          <Route path="/sessions/:id">
            <Team />
          </Route>
          <Route path="/">
            <Session />
          </Route>
        </Switch>
      </ThemeProvider>
    </Router>
  );
}

export default App;
