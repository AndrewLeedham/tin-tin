import React, { useState } from "react";
import { Switch, useParams, Route } from "react-router-dom";
import firebase from "../../firebase";
import { useObject } from "react-firebase-hooks/database";
import {
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/core";
import SelectNames from "./SelectNames";

export default function RootSession({ match }) {
  const { id: sessionId } = useParams();
  let [session, sessionLoading, sessionError] = useObject(
    firebase.database().ref(`sessions/${sessionId}`)
  );
  let [user, setUser] = useState(undefined);
  if ((!session || !session.val()) && !sessionLoading && !sessionError) {
    sessionError = "Session does not exist!";
  } else if (typeof user === "undefined") {
    let sessionUser = sessionStorage.user;
    if (sessionUser) {
      try {
        sessionUser = JSON.parse(sessionUser);
        if (sessionUser.id && session && session.val()) {
          if (!Object.keys(session.val().users).includes(user.id)) {
            sessionUser.id = undefined;
          }
        }
      } catch (e) {
        sessionUser = undefined;
        sessionError = e;
      } finally {
        setUser(sessionUser);
        if (!sessionUser) {
          delete sessionStorage.user;
        } else {
          sessionStorage.user = sessionUser;
        }
      }
    }
    if (!sessionUser || !sessionUser.id) {
      firebase
        .database()
        .ref(`sessions/${sessionId}/users`)
        .push({ names: [] })
        .then(({ key }) => {
          const newUser = {
            id: key,
            names: [],
            admin: !!(sessionUser && sessionUser.admin),
          };
          setUser(newUser);
          sessionStorage.user = JSON.stringify(newUser);
        });
    }
  }
  return (
    <>
      <Alert status="info">
        <AlertIcon />
        <AlertTitle mr={2}>User:</AlertTitle>
        <AlertDescription>{JSON.stringify(user)}</AlertDescription>
      </Alert>
      {sessionError && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Something went wrong:</AlertTitle>
          <AlertDescription>{sessionError.toString()}</AlertDescription>
          <CloseButton position="absolute" right="8px" top="8px" />
        </Alert>
      )}
      {sessionLoading && <Spinner />}
      {session && session.val() && !sessionLoading && !sessionError && user && (
        <Switch>
          <Route path={match.path}>
            <SelectNames
              session={session.val()}
              sessionId={sessionId}
              user={user}
            />
          </Route>
        </Switch>
      )}
    </>
  );
}
