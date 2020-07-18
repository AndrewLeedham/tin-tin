import React, { useState, useRef } from "react";
import {
  Button,
  Stack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/core";
import Page from "../components/Page";
import { FiPlay, FiClock } from "react-icons/fi";
import Clearfix from "../components/Clearfix";

export default function Waiting({
  user,
  startTurn,
  round,
  noNames,
  timer,
  lock,
}) {
  const [minutes, setMinutes] = useState(timer ? Math.floor(timer / 60) : 1);
  const [seconds, setSeconds] = useState(timer ? Math.floor(timer % 60) : 0);
  const secondsDiv = useRef(null);
  const minutesDiv = useRef(null);
  const [isOpen, setIsOpen] = React.useState();
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();
  return (
    <>
      <Page
        heading="Wait for your turn"
        subHeading={`Hi ${user.playerName}. Welcome to tin-tin, press "Start turn" when it is your turn. "Start round" will be shown if there are no names left.`}
        showLeave
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            startTurn(minutes, seconds);
          }}
        >
          <Stack isInline spacing={4} mb={4}>
            <FormControl>
              <FormLabel htmlFor="minutes">Minutes</FormLabel>
              <NumberInput
                id="minutes"
                value={minutes}
                min={0}
                max={5}
                isInvalid={minutes === 0 && seconds === 0}
                ref={minutesDiv}
                onChange={(value) => {
                  const minutesInput = minutesDiv.current.children[0];
                  const secondsInput = secondsDiv.current.children[0];
                  if (value === 0 && seconds === 0) {
                    minutesInput.setCustomValidity(
                      "Either minutes or seconds must be over 0"
                    );
                    minutesInput.reportValidity();
                  } else {
                    minutesInput.setCustomValidity("");
                    secondsInput.setCustomValidity("");
                  }
                  setMinutes(value);
                }}
              >
                <NumberInputField type="number" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="seconds">Seconds</FormLabel>
              <NumberInput
                id="seconds"
                value={seconds}
                min={0}
                max={60}
                isInvalid={minutes === 0 && seconds === 0}
                ref={secondsDiv}
                onChange={(value) => {
                  const minutesInput = minutesDiv.current.children[0];
                  const secondsInput = secondsDiv.current.children[0];
                  if (value === 0 && minutes === 0) {
                    secondsInput.setCustomValidity(
                      "Either minutes or seconds must be over 0"
                    );
                    secondsInput.reportValidity();
                  } else {
                    minutesInput.setCustomValidity("");
                    secondsInput.setCustomValidity("");
                  }
                  setSeconds(value);
                }}
              >
                <NumberInputField type="number" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </Stack>
          <Stack isInline justify="space-between">
            <Button
              variant="outline"
              variantColor="blue"
              rightIcon={FiClock}
              onClick={() => {
                setMinutes(1);
                setSeconds(0);
              }}
            >
              1 Minute
            </Button>
            <Button
              variant="outline"
              variantColor="blue"
              rightIcon={FiClock}
              onClick={() => {
                setSeconds(30);
                setMinutes(0);
              }}
            >
              30 seconds
            </Button>
            <Button
              type={round ? undefined : "submit"}
              variant={round ? "solid" : "outline"}
              variantColor="green"
              rightIcon={FiPlay}
              isDisabled={noNames || lock}
              onClick={round ? () => setIsOpen(true) : undefined}
            >
              Start {round ? "round" : "turn"}
            </Button>
          </Stack>
          <Clearfix />
          {lock && (
            <Text textAlign="center" py={4}>
              {lock} is currently playing
            </Text>
          )}
        </form>
      </Page>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Start new round
          </AlertDialogHeader>

          <AlertDialogBody>
            You are about to start a new round, this means all the names in the
            previous round have been answered.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              variantColor="green"
              ml={3}
              onClick={() => startTurn(minutes, seconds)}
            >
              Start round
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
