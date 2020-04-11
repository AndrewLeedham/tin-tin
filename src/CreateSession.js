import React, { useState } from "react";
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

export default function CreateSession() {
  const [count, setCount] = useState(4);
  const [key, setKey] = useState(undefined);
  useUser(true);

  async function onSubmit(event) {
    event.preventDefault();
    const { key: id } = await firebase.database().ref("sessions").push({
      count,
    });
    setKey(id);
  }

  return (
    <>
      {key ? (
        <Redirect to={`/sessions/${key}`} />
      ) : (
        <form onSubmit={onSubmit}>
          <FormControl>
            <FormLabel htmlFor="count">
              Number of names a user can select
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
          <Button type="submit">Create session</Button>
        </form>
      )}
    </>
  );
}
