import React, { useState } from "react";
import Page from "../../components/Page";
import { FormControl, FormLabel, Input, Box, Button } from "@chakra-ui/core";
import Clearfix from "../../components/Clearfix";
import firebase from "../../firebase";

export default function SelectNames({ sessionId, session, user }) {
  const [names, setNames] = useState(
    new Array(session.count).fill({ name: "Example name" })
  );

  function updateName(index, name) {
    const newNames = [...names];
    newNames[index].name = name;
    setNames(newNames);
  }

  async function submitNames(event) {
    event.preventDefault();
    await firebase
      .database()
      .ref(`sessions/${sessionId}/users/${user.id}`)
      .set(names);
  }
  const allReady =
    user.admin &&
    user.id &&
    session.users &&
    Object.values(session.users).length > 0 &&
    Object.values(session.users).every(({ names }) => !!names);

  return (
    <Page
      heading="Select names"
      subHeading="Select the names you want to add to the tin."
    >
      <form onSubmit={submitNames}>
        <Box borderWidth={1} rounded="lg" p={3} mb={4}>
          {names.map(({ name }, index) => (
            <FormControl key={index} isRequired>
              <FormLabel htmlFor={`name-${index}`}>Name {index + 1}</FormLabel>
              <Input
                id={`name-${index}`}
                value={name}
                onChange={(event) => updateName(index, event.value)}
                mb={2}
                isDisabled={!user.id}
              />
            </FormControl>
          ))}
        </Box>
        <Button type="submit" float="left" mb={2} isDisabled={!user.id}>
          Put in the tin
        </Button>
        {user.admin && (
          <Button type="submit" float="right" isDisabled={!allReady}>
            Start game
          </Button>
        )}
        <Clearfix />
      </form>
    </Page>
  );
}
