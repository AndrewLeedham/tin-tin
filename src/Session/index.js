import React from "react";

import firebase from "../firebase";
import { useObject } from "react-firebase-hooks/database";
import { useParams } from "react-router-dom";
import useUser, { USERSTATE } from "../useUser";
import Submitting from "./Submitting";
import { Spinner, Flex, Text } from "@chakra-ui/core";
import Waiting from "./Waiting";
import Playing from "./Playing";
import Error from "../components/Error";
import Page from "../components/Page";
import useAsyncError from "../useAsyncError";
import useOnlineStatus from "@rehooks/online-status";
import { trackEvent } from "../events";

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

function startTurn(sessionId, user, updateUser, throwError, round) {
  return (minutes, seconds) => {
    // Get the most up to date session, the main session object should be syned automatically.
    firebase
      .database()
      .ref(`sessions/${sessionId}`)
      .once("value")
      .then((sessionRef) => {
        const session = sessionRef.val();
        if (!session.lock) {
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
            .then(() => {
              trackEvent(sessionId, {
                event: "start_turn",
                current: JSON.stringify(session.current ?? []),
                minutes,
                seconds,
                round,
              });
            })
            .catch(throwError);
        }
      });
  };
}

function endTurn(session, sessionId, user, updateUser, throwError) {
  return (names) => {
    const before = [...names];
    const after = names.filter(({ answered }) => !answered);
    names = after.map(({ name }) => name);
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
      .then(() => {
        trackEvent(sessionId, {
          event: "end_turn",
          n: before.length - after.length,
          before: JSON.stringify(before),
          after: JSON.stringify(after),
          current: JSON.stringify(session.current ?? []),
        });
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
            sessionId,
            user,
            updateUser,
            throwError,
            !session.current || Object.values(session.current).length === 0
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
          endTurn={endTurn(session, sessionId, user, updateUser, throwError)}
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
  const isOnline = useOnlineStatus();
  return (
    <>
      {((sessionLoading && !sessionError) || !isOnline) && (
        <Flex
          alignItems="center"
          justifyContent="center"
          direction="column"
          mt={16}
        >
          {!isOnline && (
            <Text mb={4} fontSize="lg">
              Offline, reconnecting
            </Text>
          )}
          <Spinner size="xl" transform="translate(-50%, -50%)" />
        </Flex>
      )}
      {(sessionError || !sessionExists) && !sessionLoading && isOnline && (
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
        isOnline &&
        renderScreen(session.val(), sessionId, user, updateUser, throwError)}
    </>
  );
}
