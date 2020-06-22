import React from "react";
import { ThemeProvider, CSSReset, Flex, Text } from "@chakra-ui/core";
import { customTheme } from "./theme";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Session from "./Session";
import CreateSession from "./CreateSession";
import ErrorBoundary from "./components/ErrorBoundary";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  IconButton,
} from "@chakra-ui/core";
import { FiRefreshCw } from "react-icons/fi";

function App({ isUpdateAvailable, updateAssets }) {
  return (
    <Router>
      <ThemeProvider theme={customTheme}>
        <Text
          position="absolute"
          top="0"
          right="0"
          color="gray.500"
          p={2}
          fontSize="xs"
        >
          {process.env.REACT_APP_VERSION}
        </Text>
        <CSSReset />
        <ErrorBoundary>
          <Switch>
            <Route path="/sessions/:id" component={Session} />
            <Route path="/" component={CreateSession} />
          </Switch>
          {isUpdateAvailable && (
            <Flex
              position="fixed"
              bottom={2}
              left="0"
              right="0"
              justifyContent="center"
            >
              <Alert status="info" rounded="md">
                <AlertIcon />
                <AlertDescription mr={2}>
                  A new version of Tin-tin is available! Refresh to update.
                </AlertDescription>
                <IconButton
                  icon={FiRefreshCw}
                  onClick={updateAssets}
                  size="sm"
                  variant="ghost"
                />
              </Alert>
            </Flex>
          )}
        </ErrorBoundary>
      </ThemeProvider>
    </Router>
  );
}

export default App;
