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

function addNames(session, sessionId, updateUserState) {
  return (names) => {
    const previous = session.carbon ? Object.values(session.carbon) : [];
    firebase
      .database()
      .ref(`sessions/${sessionId}/carbon`)
      .set([...previous, ...names]);
    updateUserState(USERSTATE.WAITING);
  };
}

function startTurn(session, sessionId, startUserTurn) {
  return async () => {
    const next = session.current
      ? Object.values(session.current)
      : session.carbon;
    const names = next.splice(0, 4);
    await firebase
      .database()
      .ref(`sessions/${sessionId}/current`)
      .set([...next]);
    startUserTurn(names);
  };
}

function renderScreen(
  session,
  sessionId,
  user,
  updateUserState,
  startUserTurn
) {
  switch (user.state) {
    case USERSTATE.SUBMITTING:
      return (
        <Submitting
          count={session.count}
          onSubmit={addNames(session, sessionId, updateUserState)}
        />
      );
    case USERSTATE.WAITING:
      return (
        <Waiting startTurn={startTurn(session, sessionId, startUserTurn)} />
      );
    case USERSTATE.PLAYING:
      return <Playing names={user.names} />;
    default:
      return `Unknown state: ${user.state}`;
  }
}

export default function Session() {
  const { id: sessionId } = useParams();
  const [session, sessionLoading, sessionError] = useObject(
    firebase.database().ref(`sessions/${sessionId}`)
  );
  const [user, updateUserState, startUserTurn] = useUser();
  return (
    <>
      {sessionLoading && !sessionError && <Spinner />}
      {sessionError && !sessionLoading && (
        <Error
          title={"Something went wrong loading the session:"}
          description={sessionError}
        />
      )}
      {!sessionLoading &&
        !sessionError &&
        renderScreen(
          session.val(),
          sessionId,
          user,
          updateUserState,
          startUserTurn
        )}
    </>
  );
}
