import React, { useState } from "react";
import {
  Box,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputRightElement,
  IconButton,
  FormControl,
  FormLabel,
  Heading,
  Text
} from "@chakra-ui/core";
import firebase from "../firebase";
import { Redirect } from "react-router-dom";
import { MdAdd, MdRemove } from "react-icons/md";

export default function Session() {
  const [key, setKey] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [teams, setTeams] = useState([{ name: "Team name" }]);
  const [count, setCount] = useState(4);
  const [maxTeams, setMaxTeams] = useState(1);

  function addTeam() {
    setTeams([...teams, { name: `Team name ${maxTeams}` }]);
    setMaxTeams(maxTeams + 1);
  }

  function removeTeam(index) {
    const newTeams = { ...teams };
    delete newTeams[index];
    setTeams(newTeams);
  }

  function updateTeam(index, name) {
    const newTeams = [...teams];
    newTeams[index].name = name;
    setTeams(newTeams);
  }

  async function addSession(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const { key } = await firebase
        .database()
        .ref("sessions")
        .push({ timestamp: Date.now(), count, started: false });
      for (const team of teams) {
        if (team) {
          firebase
            .database()
            .ref(`teams/${key}`)
            .push(team);
        }
      }
      sessionStorage.user = JSON.stringify({
        name: "Admin",
        team: "",
        sessionId: key,
        admin: true
      });
      setKey(key);
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  }

  return (
    <Box maxW="md" m="auto" p={2}>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>
            Something went wrong creating a new session:
          </AlertTitle>
          <AlertDescription>{error.toString()}</AlertDescription>
          <CloseButton position="absolute" right="8px" top="8px" />
        </Alert>
      )}

      {key ? (
        <Redirect to={`/sessions/${key}`} />
      ) : (
        <>
          <Heading as="h1" mb={2}>
            Create a new session
          </Heading>
          <Text fontSize="xl" mb={5}>
            Select the maximum number of players per team and the team names for
            your tin tin session.
          </Text>
          <form onSubmit={addSession}>
            <FormControl>
              <FormLabel htmlFor="count">
                Maximum number of people in a team
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
                Teams
              </Heading>
              {teams.map(({ name }, index) => (
                <InputGroup size="md" mb={2} key={index}>
                  <Input
                    value={name}
                    key={index}
                    onChange={event => updateTeam(index, event.value)}
                  />
                  {index > 0 && (
                    <InputRightElement>
                      <IconButton
                        size="xs"
                        onClick={() => removeTeam(index)}
                        icon={MdRemove}
                        variantColor="red"
                      />
                    </InputRightElement>
                  )}
                </InputGroup>
              ))}
              <IconButton
                onClick={() => addTeam()}
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
        </>
      )}
    </Box>
  );
}
