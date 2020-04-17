import React from "react";
import { Button, Stack } from "@chakra-ui/core";
import Page from "../components/Page";
import { MdTimer } from "react-icons/md";

export default function Waiting({ startTurn, round, noNames }) {
  return (
    <Page
      heading="Tin-tin"
      subHeading='Welcome to tin-tin, press "Start turn" when it is your go. "Start round" will be shown if there are no names left.'
    >
      <Stack isInline justify="center" spacing={2}>
        <Button
          onClick={startTurn}
          variant="solid"
          variantColor="green"
          rightIcon={MdTimer}
          isDisabled={noNames}
        >
          Start {round ? "round" : "turn"}
        </Button>
      </Stack>
    </Page>
  );
}
