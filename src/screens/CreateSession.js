import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  FormControl,
  FormLabel,
  Heading,
} from "@chakra-ui/core";
import firebase from "../firebase";
import { Redirect } from "react-router-dom";
import { MdAdd, MdRemove } from "react-icons/md";
import Page from "../components/Page";
import Clearfix from "../components/Clearfix";

export default function CreateSession() {
  const [key, setKey] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [rounds, setRounds] = useState([{ name: "Round name", duration: 60 }]);
  const [count, setCount] = useState(4);
  const [maxRounds, setMaxRounds] = useState(1);

  function addRound() {
    setRounds([...rounds, { name: `Round name ${maxRounds}`, duration: 60 }]);
    setMaxRounds(maxRounds + 1);
  }

  function removeRound(index) {
    const newRounds = [...rounds];
    newRounds.splice(index, 1);
    setRounds(newRounds);
  }

  function updateRoundName(index, name) {
    const newRounds = [...rounds];
    newRounds[index].name = name;
    setRounds(newRounds);
  }

  function updateRoundDuration(index, duration) {
    const newRounds = [...rounds];
    newRounds[index].duration = duration;
    setRounds(newRounds);
  }

  async function addSession(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const { key } = await firebase
        .database()
        .ref("sessions")
        .push({ timestamp: Date.now(), count, started: false });
      for (const round of rounds) {
        if (round) {
          firebase.database().ref(`sessions/${key}/rounds`).push(round);
        }
      }
      sessionStorage.user = JSON.stringify({ admin: true });
      setKey(key);
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  }

  return key ? (
    <Redirect to={`/sessions/${key}`} />
  ) : (
    <Page
      heading="Create a new session"
      subHeading="Select the number of names per user and the round name and durations for your tin tin session."
      error={error}
    >
      <form onSubmit={addSession}>
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
        <Box borderWidth={1} rounded="lg" p={3} mb={4}>
          <Heading as="h2" size="md" mb="2">
            Rounds
          </Heading>
          {rounds.map(({ name, duration }, index) => (
            <Box
              key={index}
              borderWidth={1}
              p={3}
              mb={4}
              pos="relative"
              borderRadius="lg"
            >
              {index > 0 && (
                <IconButton
                  size="xs"
                  onClick={() => removeRound(index)}
                  icon={MdRemove}
                  variantColor="red"
                  pos="absolute"
                  top={0}
                  right={0}
                  rounded={false}
                  style={{ borderTopRightRadius: "0.25rem" }}
                />
              )}
              <FormControl mb={2}>
                <FormLabel htmlFor={`name-${index}`}>
                  Name of the round
                </FormLabel>
                <Input
                  value={name}
                  key={index}
                  onChange={(event) => updateRoundName(index, event.value)}
                />
              </FormControl>
              <FormControl mb={2}>
                <FormLabel htmlFor={`duration-${index}`}>
                  Duration for the round (in seconds)
                </FormLabel>
                <NumberInput
                  id={`duration-${index}`}
                  defaultValue={duration}
                  min={10}
                  max={120}
                  onChange={(value) => updateRoundDuration(index, value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </Box>
          ))}
          <IconButton
            onClick={() => addRound()}
            icon={MdAdd}
            variantColor="green"
            size="xs"
            m="auto"
            d="flex"
          />
        </Box>
        <Button type="submit" isLoading={loading} float="right">
          Create new session
        </Button>
      </form>
      <Clearfix />
    </Page>
  );
}
