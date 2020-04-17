import React, { useState } from "react";
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
} from "@chakra-ui/core";
import Page from "../components/Page";
import { Swipeable, direction } from "react-deck-swiper";
import { noselect } from "./Playing.module.css";
import Clearfix from "../components/Clearfix";
import { MdTimerOff, MdCheck, MdClose } from "react-icons/md";

export default function Playing({ names: initialNames, endTurn }) {
  const [names, setNames] = useState(initialNames);
  const [currentTile, setCurrentTile] = useState(0);
  const [passed, setPassed] = useState(undefined);
  const [isOpen, setIsOpen] = React.useState();
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  function updateName(index, value) {
    const newNames = [...names];
    newNames[index].answered = !!value;
    setNames(newNames);
  }

  function onSwipe(swipeDirection) {
    let answeredPassed = false;
    if (swipeDirection === direction.LEFT) {
      if (typeof passed !== "undefined") {
        updateName(passed, true);
        setPassed(undefined);
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
        setCurrentTile(undefined);
      }
    }
  }

  return (
    <>
      <Page heading="Tin-tin">
        {typeof currentTile !== "undefined" || typeof passed !== "undefined" ? (
          <Swipeable
            onSwipe={onSwipe}
            renderButtons={({ left, right }) => (
              <Stack
                isInline
                flex="1"
                justifyContent="space-between"
                spacing={2}
                p={8}
              >
                <IconButton
                  size="lg"
                  aria-label={
                    typeof passed === "undefined" ? "Pass" : "Answered passed"
                  }
                  icon={typeof passed === "undefined" ? MdClose : MdCheck}
                  variant="solid"
                  variantColor={
                    typeof passed === "undefined" ? "red" : "orange"
                  }
                  onClick={left}
                />
                {typeof passed !== "undefined" &&
                  typeof currentTile !== "undefined" && (
                    <Text>
                      <strong>Passed:</strong> {names[passed].name}
                    </Text>
                  )}
                <IconButton
                  size="lg"
                  aria-label={
                    typeof currentTile !== "undefined"
                      ? "Correct"
                      : "Answered passed"
                  }
                  icon={MdCheck}
                  variantColor={
                    typeof currentTile !== "undefined" ? "green" : "orange"
                  }
                  onClick={typeof currentTile !== "undefined" ? right : left}
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
                {typeof currentTile !== "undefined"
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
        <Stack isInline justify="center" spacing={2} mt={10}>
          <Button
            variant="outline"
            variantColor="red"
            rightIcon={MdTimerOff}
            onClick={() => setIsOpen(true)}
          >
            End turn
          </Button>
        </Stack>
        <Clearfix />
      </Page>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Double check you did not mis-click anything:
          </AlertDialogHeader>

          <AlertDialogBody>
            {names
              .slice(
                0,
                typeof currentTile !== "undefined"
                  ? currentTile + 1
                  : names.length
              )
              .map(({ name, answered }, index) => (
                <Checkbox
                  id={`name-${index}`}
                  isChecked={answered}
                  onChange={(event) => updateName(index, event.target.checked)}
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
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button variantColor="green" onClick={() => endTurn(names)} ml={3}>
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
