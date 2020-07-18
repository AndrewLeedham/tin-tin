import React, { useState, useRef } from "react";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/core";
import Page from "../components/Page";
import { MdSend, MdSkipNext } from "react-icons/md";
import Clearfix from "../components/Clearfix";
import TextSeperator from "../components/TextSeperator";

export default function Submitting({ count, onSubmit }) {
  const [names, setNames] = useState(new Array(count).fill(""));
  const [playerName, setPlayerName] = useState("");
  const playerNameRef = useRef(null);

  function updateName(index, name) {
    const newNames = [...names];
    newNames[index] = name;
    setNames(newNames);
  }
  return (
    <Page
      heading="Submit your names"
      subHeading={`Enter the ${count} names you want to put in the tin, then press "Submit names".`}
      showLeave
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(playerName, names);
        }}
      >
        <FormControl isRequired mb={4}>
          <FormLabel htmlFor="player-name">Your name</FormLabel>
          <Input
            id="player-name"
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            mb={2}
            minLength={1}
            maxLength={30}
            ref={playerNameRef}
          />
        </FormControl>
        <TextSeperator marginY={10} />
        {names.map((name, index) => (
          <FormControl key={index} isRequired mb={4}>
            <FormLabel htmlFor={`name-${index}`}>Name {index + 1}</FormLabel>
            <Input
              id={`name-${index}`}
              value={name}
              onChange={(event) => updateName(index, event.target.value)}
              mb={2}
              minLength={1}
              maxLength={30}
            />
          </FormControl>
        ))}
        <Button
          type="submit"
          variant="solid"
          variantColor="green"
          rightIcon={MdSend}
          float="right"
        >
          Submit names
        </Button>
        <Button
          variant="outline"
          rightIcon={MdSkipNext}
          float="left"
          onClick={() => {
            const playerNameInput = playerNameRef.current;
            if (playerNameInput.checkValidity()) {
              onSubmit(playerName, []);
            } else {
              playerNameInput.reportValidity();
            }
          }}
        >
          Skip and join
        </Button>
      </form>
      <Clearfix />
    </Page>
  );
}
