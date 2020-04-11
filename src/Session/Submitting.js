import React, { useState } from "react";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/core";

export default function Submitting({ count, onSubmit }) {
  const [names, setNames] = useState(new Array(count).fill(""));

  function updateName(index, name) {
    const newNames = [...names];
    newNames[index] = name;
    setNames(newNames);
  }
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(names);
      }}
    >
      {names.map((name, index) => (
        <FormControl key={index} isRequired>
          <FormLabel htmlFor={`name-${index}`}>Name {index + 1}</FormLabel>
          <Input
            id={`name-${index}`}
            value={name}
            onChange={(event) => updateName(index, event.target.value)}
            mb={2}
          />
        </FormControl>
      ))}
      <Button type="submit">Submit names</Button>
    </form>
  );
}
