import React from "react";

import firebase from "../firebase";
import { useObject } from "react-firebase-hooks/database";
import { useParams } from "react-router-dom";
import useUser, { USERSTATE } from "../useUser";
import Submitting from "./Submitting";
import { Spinner } from "@chakra-ui/core";
import Error from "../components/Error";
import Waiting from "./Waiting";
import Playing from "./Playing";

function addNames(session, sessionId, user, updateUser) {
  return (names) => {
    const previous = session.carbon ? Object.values(session.carbon) : [];
    firebase
      .database()
      .ref(`sessions/${sessionId}/carbon`)
      .set([...previous, ...names]);
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

function startTurn(session, sessionId, user, updateUser) {
  return async () => {
    const names = session.current
      ? Object.values(session.current)
      : Object.values(session.carbon);
    if (!session.current) {
      await firebase
        .database()
        .ref(`sessions/${sessionId}/current`)
        .set([...names]);
    }
    updateUser({
      ...user,
      names: shuffle(names).map((name) => ({ name, answered: false })),
      state: USERSTATE.PLAYING,
    });
  };
}

function endTurn(sessionId, user, updateUser) {
  return async (names) => {
    names = names.filter(({ answered }) => !answered).map(({ name }) => name);
    await firebase
      .database()
      .ref(`sessions/${sessionId}/current`)
      .set([...names]);
    updateUser({ ...user, names: undefined, state: USERSTATE.WAITING });
  };
}

function renderScreen(session, sessionId, user, updateUser) {
  switch (user.state) {
    case USERSTATE.SUBMITTING:
      return (
        <Submitting
          count={session.count}
          onSubmit={addNames(session, sessionId, user, updateUser)}
        />
      );
    case USERSTATE.WAITING:
      return (
        <Waiting
          startTurn={startTurn(session, sessionId, user, updateUser)}
          round={
            !session.current || Object.values(session.current).length === 0
          }
        />
      );
    case USERSTATE.PLAYING:
      return (
        <Playing
          names={user.names}
          admin={user.admin}
          endTurn={endTurn(sessionId, user, updateUser)}
        />
      );
    default:
      return `Unknown state: ${user.state}`;
  }
}

export default function Session() {
  const { id: sessionId } = useParams();
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
        <Error
          title={"Something went wrong loading the session:"}
          description={sessionError}
        />
      )}
      {!sessionLoading &&
        !sessionError &&
        renderScreen(session.val(), sessionId, user, updateUser)}
    </>
  );
}
