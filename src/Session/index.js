import React from "react";

import firebase from "../firebase";
import { useObject } from "react-firebase-hooks/database";
import { useParams } from "react-router-dom";
import useUser, { USERSTATE } from "../useUser";
import Submitting from "./Submitting";
import { Spinner, Flex } from "@chakra-ui/core";
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
      .then(() => {
        updateUser({ ...user, state: USERSTATE.WAITING });
      })
      .catch(throwError);
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
  return (minutes, seconds) => {
    firebase
      .database()
      .ref(`sessions/${sessionId}/lock`)
      .set(true)
      .then(async () => {
        const names = session.current
          ? Object.values(session.current)
          : Object.values(session.carbon);
        if (!session.current) {
          await firebase
            .database()
            .ref(`sessions/${sessionId}/current`)
            .set([...names])
            .catch(throwError);
        }
        return names;
      })
      .then((names) => {
        updateUser({
          ...user,
          names: shuffle(names).map((name) => ({
            name,
            answered: false,
          })),
          state: USERSTATE.PLAYING,
          timer: minutes * 60 + seconds,
        });
      })
      .catch(throwError);
  };
}

function endTurn(sessionId, user, updateUser, throwError) {
  return (names) => {
    names = names.filter(({ answered }) => !answered).map(({ name }) => name);
    firebase
      .database()
      .ref(`sessions/${sessionId}/current`)
      .set([...names])
      .then(() =>
        firebase.database().ref(`sessions/${sessionId}/lock`).set(false)
      )
      .then(() => {
        updateUser({ ...user, names: undefined, state: USERSTATE.WAITING });
      })
      .catch(throwError);
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
          timer={user.timer}
          lock={!!session.lock}
        />
      );
    case USERSTATE.PLAYING:
      return (
        <Playing
          names={user.names}
          timer={user.timer}
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
  const sessionExists = session && session.val();
  return (
    <>
      {sessionLoading && !sessionError && (
        <Flex alignItems="center" justifyContent="center" mt={16}>
          <Spinner size="xl" transform="translate(-50%, -50%)" />
        </Flex>
      )}
      {(sessionError || !sessionExists) && !sessionLoading && (
        <Page>
          <Error
            title={sessionError ? undefined : "Session ID does not exist"}
            error={
              sessionError
                ? sessionError.toString()
                : "Please check you copied it correctly"
            }
          />
        </Page>
      )}
      {!sessionLoading &&
        !sessionError &&
        sessionExists &&
        renderScreen(session.val(), sessionId, user, updateUser, throwError)}
    </>
  );
}
