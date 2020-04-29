import React from "react";
import {
  Button,
  Box,
  Checkbox,
  Text,
  Stack,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Flex,
} from "@chakra-ui/core";
import Page from "../components/Page";
import { Swipeable, direction } from "react-deck-swiper";
import { noselect } from "./Playing.module.css";
import Clearfix from "../components/Clearfix";
import { FiPause, FiCheck, FiX, FiClock, FiVolumeX } from "react-icons/fi";
import Timer from "../components/Timer";
import useLocalStorageState from "../useLocalStorageState";
import useTimer from "../useTimer";

export default function Playing({ names: initialNames, endTurn, timer }) {
  const [names, setNames, cleanupNames] = useLocalStorageState(
    "names",
    initialNames
  );
  const [
    currentTile,
    setCurrentTile,
    cleanupCurrentTile,
  ] = useLocalStorageState("currentTile", 0);
  const [passed, setPassed, cleanupPassed] = useLocalStorageState(
    "passed",
    null
  );
  const [isOpen, setIsOpen, cleanupIsOpen] = useLocalStorageState(
    "isOpen",
    false
  );
  const [
    isCancelable,
    setIsCancelable,
    cleanupIsCancelable,
  ] = useLocalStorageState("isCancelable", true);

  const [
    time,
    isPaused,
    setIsPaused,
    resetTimer,
    cleanupTimer,
    alarmPlaying,
    stopAlarm,
  ] = useTimer(timer, () => {
    setIsCancelable(false);
    setIsOpen(true);
  });

  const closeAlert = () => {
    setIsPaused(false);
    setIsOpen(false);
  };
  function openAlert() {
    setIsPaused(true);
    setIsOpen(true);
  }
  const cancelRef = React.useRef();

  function end() {
    cleanupNames();
    cleanupCurrentTile();
    cleanupPassed();
    cleanupIsOpen();
    cleanupIsCancelable();
    cleanupTimer();
    endTurn(names);
  }

  function updateName(index, value) {
    const newNames = [...names];
    newNames[index].answered = !!value;
    setNames(newNames);
  }

  function onSwipe(swipeDirection) {
    let answeredPassed = false;
    if (swipeDirection === direction.LEFT) {
      if (passed !== null) {
        updateName(passed, true);
        setPassed(null);
        answeredPassed = true;
      } else {
        setPassed(currentTile);
      }
    } else if (swipeDirection === direction.RIGHT) {
      updateName(currentTile, true);
    }
    if (!answeredPassed) {
      if (currentTile + 1 < names.length) {
        setCurrentTile(currentTile + 1);
      } else {
        setCurrentTile(null);
      }
    }
  }

  const outOf =
    currentTile !== null || passed !== null
      ? `${(currentTile ?? passed) + 1}/${names.length}`
      : "";

  return (
    <>
      <Page heading={`Tin-tin ${outOf}`}>
        {currentTile !== null || passed !== null ? (
          <Swipeable
            onSwipe={onSwipe}
            renderButtons={({ left, right }) => (
              <Stack
                isInline
                flex="1"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                p={8}
              >
                <IconButton
                  size="lg"
                  aria-label={passed === null ? "Pass" : "Answered passed"}
                  icon={passed === null ? FiX : FiCheck}
                  variant="solid"
                  variantColor={passed === null ? "red" : "orange"}
                  onClick={left}
                />
                {passed !== null && currentTile !== null && (
                  <Text flexGrow="1">
                    <strong>Passed:</strong> {names[passed].name}
                  </Text>
                )}
                <IconButton
                  size="lg"
                  aria-label={
                    currentTile !== null ? "Correct" : "Answered passed"
                  }
                  icon={FiCheck}
                  variantColor={currentTile !== null ? "green" : "orange"}
                  onClick={currentTile !== null ? right : left}
                />
              </Stack>
            )}
          >
            <Box
              rounded="lg"
              borderWidth={1}
              py="6rem"
              px={2}
              textAlign="center"
            >
              <Text fontSize="3xl" className={noselect}>
                {currentTile !== null
                  ? names[currentTile].name
                  : `Passed: ${names[passed].name}`}
              </Text>
            </Box>
          </Swipeable>
        ) : (
          <Box py="6rem" px={2} textAlign="center">
            <Text fontSize="3xl" color="grey.200">
              No more names!
            </Text>
          </Box>
        )}
        <Flex justifyContent="space-between" mt={10}>
          <Timer
            time={time}
            reset={resetTimer}
            initialTime={timer}
            isPaused={isPaused}
            toggle={() => setIsPaused(!isPaused)}
          />
          <Button
            variant="outline"
            variantColor="red"
            rightIcon={FiPause}
            onClick={openAlert}
          >
            End turn
          </Button>
        </Flex>
        <Clearfix />
      </Page>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={isCancelable && cancelRef}
        onClose={isCancelable && closeAlert}
        closeOnOverlayClick={isCancelable}
        closeOnEsc={isCancelable}
      >
        <AlertDialogOverlay />
        {alarmPlaying ? (
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
              textAlign="center"
            >
              Time is up!
            </AlertDialogHeader>
            <AlertDialogBody paddingBottom={5}>
              <Stack isInline justify="center">
                <Button
                  onClick={stopAlarm}
                  flexDirection={"column"}
                  paddingX={8}
                  paddingY={12}
                  variantColor="red"
                >
                  <FiVolumeX size={30} style={{ marginBottom: "0.5rem" }} />
                  Stop Alarm
                </Button>
              </Stack>
            </AlertDialogBody>
          </AlertDialogContent>
        ) : (
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Double check you did not mis-click anything:
            </AlertDialogHeader>

            <AlertDialogBody>
              {names
                .slice(0, currentTile !== null ? currentTile + 1 : names.length)
                .map(({ name, answered }, index) => (
                  <Checkbox
                    id={`name-${index}`}
                    isChecked={answered}
                    onChange={(event) =>
                      updateName(index, event.target.checked)
                    }
                    isInline
                    isFullWidth
                    key={index}
                    rounded="md"
                    borderWidth={1}
                    p={2}
                    mb={2}
                  >
                    {name}
                  </Checkbox>
                ))}
              <Text>
                You scored
                {": " +
                  names.reduce(
                    (total, { answered }) => (total += Number(answered)),
                    0
                  )}
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              {isCancelable && (
                <Button ref={cancelRef} onClick={closeAlert}>
                  Cancel
                </Button>
              )}
              <Button variantColor="green" onClick={end} ml={3}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </>
  );
}
