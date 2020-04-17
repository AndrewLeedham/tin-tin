import React from "react";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import { customTheme } from "./theme";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Session from "./Session";
import CreateSession from "./CreateSession";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <Router>
      <ThemeProvider theme={customTheme}>
        <CSSReset />
        <ErrorBoundary>
          <Switch>
            <Route path="/sessions/:id" component={Session} />
            <Route path="/" component={CreateSession} />
          </Switch>
        </ErrorBoundary>
      </ThemeProvider>
    </Router>
  );
}

export default App;
