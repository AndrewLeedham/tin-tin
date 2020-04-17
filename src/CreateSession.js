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
} from "@chakra-ui/core";
import { Redirect } from "react-router-dom";
import useUser from "./useUser";
import firebase from "./firebase";
import Page from "./components/Page";
import { MdAdd } from "react-icons/md";
import Clearfix from "./components/Clearfix";
import useAsyncError from "./useAsyncError";

export default function CreateSession() {
  const [count, setCount] = useState(4);
  const [key, setKey] = useState(undefined);
  const [user, updateUser] = useUser();
  const throwError = useAsyncError();
  useEffect(() => {
    if (user.sessionId) {
      setKey(user.sessionId);
    }
  }, [user.sessionId]);

  function onSubmit(event) {
    event.preventDefault();
    firebase
      .database()
      .ref("sessions")
      .push({
        count,
      })
      .then(({ key: sessionId }) => {
        updateUser({ ...user, sessionId });
      })
      .catch((e) => {
        throwError(e);
      });
  }

  return (
    <>
      {key ? (
        <Redirect to={`/sessions/${key}`} />
      ) : (
        <Page
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
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <Button
              type="submit"
              variant="solid"
              variantColor="green"
              rightIcon={MdAdd}
              float="right"
            >
              Create new session
            </Button>
          </form>
          <Clearfix />
        </Page>
      )}
    </>
  );
}
