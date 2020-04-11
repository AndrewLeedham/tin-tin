import React from "react";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import { customTheme } from "./theme";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CreateSession from "./screens/CreateSession";
import RootSession from "./screens/session";

function App() {
  return (
    <Router>
      <ThemeProvider theme={customTheme}>
        <CSSReset />
        <Switch>
          <Route path="/sessions/:id" component={RootSession} />
          <Route path="/" component={CreateSession} />
        </Switch>
      </ThemeProvider>
    </Router>
  );
}

export default App;
