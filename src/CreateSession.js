import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Spinner,
  Input,
  InputGroup,
} from "@chakra-ui/core";
import { Redirect, useHistory } from "react-router-dom";
import useUser from "./useUser";
import firebase from "./firebase";
import Page from "./components/Page";
import { FiPlus, FiLogIn, FiLogOut, FiUserPlus } from "react-icons/fi";
import Clearfix from "./components/Clearfix";
import useAsyncError from "./useAsyncError";
import { useAuthState } from "react-firebase-hooks/auth";
import Error from "./components/Error";
import TextSeperator from "./components/TextSeperator";

export default function CreateSession() {
  const [session, setSession] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let [admin, loading, error] = useAuthState(firebase.auth());
  const [authError, setAuthError] = useState(undefined);
  const [count, setCount] = useState(4);
  const [key, setKey] = useState(undefined);
  const [customID, setCustomID] = useState("");
  const [user, updateUser] = useUser();
  const throwError = useAsyncError();
  const history = useHistory();

  useEffect(() => {
    if (user.sessionId) {
      setKey(user.sessionId);
    }
  }, [user.sessionId]);

  function onSubmit(event) {
    event.preventDefault();
    const customPromise =
      !!customID && customID.length > 0 && customID.length < 20
        ? firebase
            .database()
            .ref(`sessions/${customID}`)
            .once("value")
            .then((session) => !session.val())
        : Promise.resolve(false);

    customPromise.then((useCustom) => {
      if (useCustom) {
        firebase
          .database()
          .ref(`sessions/${customID}`)
          .set({
            count,
            timestamp: Date.now(),
          })
          .then(() => {
            updateUser({ ...user, sessionId: customID });
          })
          .catch(throwError);
      } else {
        firebase
          .database()
          .ref("sessions")
          .push({
            count,
            timestamp: Date.now(),
          })
          .then(({ key: sessionId }) => {
            updateUser({ ...user, sessionId });
          })
          .catch(throwError);
      }
    });
  }

  function signin() {
    setAuthError(undefined);
    firebase
      .auth()
      .signInWithEmailAndPassword(username, password)
      .catch(setAuthError);
  }

  function signout() {
    firebase.auth().signOut().catch(setAuthError);
  }

  function renderJoin() {
    return (
      <>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            history.push(`/sessions/${encodeURIComponent(session)}`);
          }}
        >
          <FormControl mb={4}>
            <FormLabel htmlFor="session">Enter a session id:</FormLabel>
            <InputGroup size="md">
              <Input
                type="text"
                id="session"
                value={session}
                onChange={(event) => setSession(event.target.value)}
                style={{
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  borderRight: 0,
                }}
                isRequired
              />
            </InputGroup>
          </FormControl>
          <Button
            type="submit"
            size="md"
            variantColor="green"
            rightIcon={FiUserPlus}
          >
            Join
          </Button>
        </form>
      </>
    );
  }

  return (
    <>
      {loading && !error && (
        <Spinner
          size="xl"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        />
      )}
      {!loading && error && (
        <Page>
          <Error error={error.toString()} />
        </Page>
      )}
      {!loading &&
        !error &&
        admin &&
        (key ? (
          <Redirect to={`/sessions/${key}`} />
        ) : (
          <Page
            header={true}
            heading="Create a new session"
            subHeading="Start a new tin-tin game session with the number of names per player you want. You will be redirected to a shareable url that other players can join from."
          >
            <form onSubmit={onSubmit}>
              <FormControl>
                <FormLabel htmlFor="count">
                  Number of names a player can select
                </FormLabel>
                <NumberInput
                  id="count"
                  defaultValue={count}
                  min={1}
                  max={10}
                  onChange={setCount}
                  mb={4}
                >
                  <NumberInputField type="number" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="customID">Custom Session ID</FormLabel>
                <Input
                  id="customID"
                  type="text"
                  onChange={(event) => setCustomID(event.target.value)}
                  value={customID}
                  mb={4}
                />
              </FormControl>
              <Button
                variant="outline"
                rightIcon={FiLogOut}
                float="left"
                onClick={() => signout()}
              >
                Logout
              </Button>
              <Button
                type="submit"
                variant="solid"
                variantColor="green"
                rightIcon={FiPlus}
                float="right"
              >
                Create new session
              </Button>
            </form>
            <Clearfix />
            <TextSeperator text="or" marginY={10} />
            {renderJoin()}
          </Page>
        ))}
      {!admin && !loading && !error && (
        <Page
          header={true}
          subHeading="Join a session with a unique session id or login to create a new session (closed beta)."
        >
          {authError && <Error error={authError} />}
          {renderJoin()}
          <TextSeperator text="or" marginY={10} />
          <form
            onSubmit={(event) => {
              event.preventDefault();
              signin();
            }}
          >
            <FormControl isRequired mb={4}>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                type="email"
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                mb={2}
              />
            </FormControl>
            <FormControl isRequired mb={4}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                mb={2}
              />
            </FormControl>
            <Button
              type="submit"
              variant="solid"
              variantColor="green"
              rightIcon={FiLogIn}
            >
              Sign in
            </Button>
          </form>
        </Page>
      )}
    </>
  );
}
