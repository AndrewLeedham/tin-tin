import React from "react";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import { customTheme } from "./theme";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Session from "./Session";
import CreateSession from "./CreateSession";

function App() {
  return (
    <Router>
      <ThemeProvider theme={customTheme}>
        <CSSReset />
        <Switch>
          <Route path="/sessions/:id" component={Session} />
          <Route path="/" component={CreateSession} />
        </Switch>
      </ThemeProvider>
    </Router>
  );
}

export default App;
