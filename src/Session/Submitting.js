import React, { useState } from "react";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/core";
import Page from "../components/Page";
import { MdSend, MdSkipNext } from "react-icons/md";
import Clearfix from "../components/Clearfix";

export default function Submitting({ count, onSubmit }) {
  const [names, setNames] = useState(new Array(count).fill(""));

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
          onSubmit(names);
        }}
      >
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
          onClick={() => onSubmit([])}
        >
          Skip and join
        </Button>
      </form>
      <Clearfix />
    </Page>
  );
}
