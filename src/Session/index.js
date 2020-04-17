import React from "react";

import firebase from "../firebase";
import { useObject } from "react-firebase-hooks/database";
import { useParams } from "react-router-dom";
import useUser, { USERSTATE } from "../useUser";
import Submitting from "./Submitting";
import { Spinner } from "@chakra-ui/core";
import Waiting from "./Waiting";
import Playing from "./Playing";
import Error from "../components/Error";
import Page from "../components/Page";
import useAsyncError from "../useAsyncError";

function addNames(session, sessionId, user, updateUser, throwError) {
  return (names) => {
    const previous = session.carbon ? Object.values(session.carbon) : [];
    firebase
      .database()
      .ref(`sessions/${sessionId}/carbon`)
      .set([...previous, ...names])
      .catch(throwError);
    updateUser({ ...user, state: USERSTATE.WAITING });
  };
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startTurn(session, sessionId, user, updateUser, throwError) {
  return () => {
    const names = session.current
      ? Object.values(session.current)
      : Object.values(session.carbon);
    if (!session.current) {
      firebase
        .database()
        .ref(`sessions/${sessionId}/current`)
        .set([...names])
        .catch(throwError);
    }
    updateUser({
      ...user,
      names: shuffle(names).map((name) => ({ name, answered: false })),
      state: USERSTATE.PLAYING,
    });
  };
}

function endTurn(sessionId, user, updateUser, throwError) {
  return (names) => {
    names = names.filter(({ answered }) => !answered).map(({ name }) => name);
    firebase
      .database()
      .ref(`sessions/${sessionId}/current`)
      .set([...names])
      .catch(throwError);
    updateUser({ ...user, names: undefined, state: USERSTATE.WAITING });
  };
}

function renderScreen(session, sessionId, user, updateUser, throwError) {
  switch (user.state) {
    case USERSTATE.SUBMITTING:
      return (
        <Submitting
          count={session.count}
          onSubmit={addNames(session, sessionId, user, updateUser, throwError)}
        />
      );
    case USERSTATE.WAITING:
      return (
        <Waiting
          startTurn={startTurn(
            session,
            sessionId,
            user,
            updateUser,
            throwError
          )}
          round={
            !session.current || Object.values(session.current).length === 0
          }
          noNames={
            !session.carbon || Object.values(session.carbon).length === 0
          }
        />
      );
    case USERSTATE.PLAYING:
      return (
        <Playing
          names={user.names}
          admin={user.admin}
          endTurn={endTurn(sessionId, user, updateUser, throwError)}
        />
      );
    default:
      return `Unknown state: ${user.state}`;
  }
}

export default function Session() {
  const { id: sessionId } = useParams();
  const throwError = useAsyncError();
  const [session, sessionLoading, sessionError] = useObject(
    firebase.database().ref(`sessions/${sessionId}`)
  );
  const [user, updateUser] = useUser(sessionId);
  return (
    <>
      {sessionLoading && !sessionError && (
        <Spinner
          size="xl"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        />
      )}
      {sessionError && !sessionLoading && (
        <Page>
          <Error error={sessionError.toString()} />
        </Page>
      )}
      {!sessionLoading &&
        !sessionError &&
        renderScreen(session.val(), sessionId, user, updateUser, throwError)}
    </>
  );
}
