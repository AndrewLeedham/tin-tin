import {
  Stack,
  Input,
  FormControl,
  FormLabel,
  Checkbox,
  Flex,
  IconButton,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  useTheme,
} from "@chakra-ui/core";
import React, { useState } from "react";
import { BlockPicker } from "react-color";

export default function TeamSetup(props) {
  const theme = useTheme();
  const colours = [
    theme.colors.gray[500],
    theme.colors.teal[500],
    theme.colors.blue[500],
    theme.colors.cyan[500],
    theme.colors.green[500],
    theme.colors.yellow[500],
    theme.colors.orange[500],
    theme.colors.red[500],
    theme.colors.pink[500],
    theme.colors.purple[500],
  ];
  function pickColour() {
    return colours[Math.round(Math.random() * (colours.length - 1))];
  }
  const [enabled, setEnabled] = useState(true);
  const [teams, setTeams] = useState(
    new Array(2).fill(undefined).map((_, index) => ({
      name: `Team ${index + 1}`,
      colour: pickColour(),
      showColourPicker: false,
    }))
  );

  return (
    <FormControl {...props}>
      <Flex justifyContent="space-between">
        <FormLabel>Teams</FormLabel>
        <Checkbox
          value={enabled}
          defaultIsChecked
          onChange={(event) => {
            setEnabled(event.target.checked);
          }}
        >
          Enable teams?
        </Checkbox>
      </Flex>
      {enabled ? (
        <Stack>
          {teams.map(({ name, colour, showColourPicker }, index) => {
            function openColourPicker() {
              const newTeams = teams
                .slice()
                .map((team) => ({ ...team, showColourPicker: false }));
              newTeams[index] = {
                ...newTeams[index],
                showColourPicker: true,
              };
              setTeams(newTeams);
            }
            function closeColourPicker() {
              const newTeams = teams.slice();
              newTeams[index] = {
                ...newTeams[index],
                showColourPicker: false,
              };
              setTeams(newTeams);
            }
            return (
              <InputGroup key={index}>
                <InputLeftElement zIndex={teams.length - index}>
                  <IconButton
                    aria-label="Change colour"
                    backgroundColor={colour}
                    size="xs"
                    isRound
                    onClick={openColourPicker}
                  />
                  {showColourPicker && (
                    <>
                      <div
                        style={{
                          position: "fixed",
                          top: "0",
                          right: "0",
                          bottom: "0",
                          left: "0",
                        }}
                        onClick={closeColourPicker}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      >
                        <BlockPicker
                          color={colour}
                          colors={colours}
                          onChangeComplete={(color) => {
                            const newTeams = teams.slice();
                            newTeams[index] = {
                              ...newTeams[index],
                              colour: color.hex,
                              showColourPicker: false,
                            };
                            setTeams(newTeams);
                          }}
                        />
                      </div>
                    </>
                  )}
                </InputLeftElement>
                <Input
                  placeholder="Team name"
                  value={name}
                  onChange={(event) => {
                    const newTeams = teams.slice();
                    newTeams[index] = {
                      ...newTeams[index],
                      name: event.target.value,
                    };
                    setTeams(newTeams);
                  }}
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Remove team"
                    icon="delete"
                    variantColor="red"
                    variant="ghost"
                    onClick={() => {
                      const newTeams = teams.slice();
                      newTeams.splice(index, 1);
                      setTeams(newTeams);
                    }}
                  />
                </InputRightElement>
              </InputGroup>
            );
          })}
          <IconButton
            aria-label="Add team"
            icon="add"
            variantColor="green"
            variant="outline"
            onClick={() => {
              const newTeams = teams.slice();
              newTeams.push({
                name: `Team ${teams.length + 1}`,
                colour: pickColour(),
              });
              setTeams(newTeams);
            }}
          />
        </Stack>
      ) : undefined}
    </FormControl>
  );
}
