import React, { useState } from "react";
import {
  Box,
  Text,
  Button,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Spinner,
  Heading,
  FormControl,
  FormLabel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from "@chakra-ui/core";
import { MdAdd, MdRemove } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useList, useObject } from "react-firebase-hooks/database";
import firebase, { cleanupSession } from "../firebase";

export default function Team() {
  const { id: sessionId } = useParams();
  const [session, sessionLoading, sessionError] = useObject(
    firebase.database().ref(`sessions/${sessionId}`)
  );
  const timestamp = !sessionLoading && session?.val().timestamp;

  const [teams, teamsLoading, teamsError] = useList(
    firebase.database().ref(`teams/${sessionId}`)
  );

  const [users, usersLoading, usersError] = useList(
    firebase.database().ref(`users/${sessionId}`)
  );

  let localUser = sessionStorage.user && JSON.parse(sessionStorage.user);
  const [user, setUser] = useState(
    localUser && localUser.sessionId === sessionId
      ? localUser
      : {
          name: "Your name",
          team: "",
          sessionId,
          admin: false
        }
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  async function updateUser(newUser) {
    if (newUser.id) {
      await firebase
        .database()
        .ref(`users/${sessionId}/${newUser.id}`)
        .set(newUser);
      setUser(newUser);
      sessionStorage.user = JSON.stringify(newUser);
    } else {
      const { key: id } = await firebase
        .database()
        .ref(`users/${sessionId}`)
        .push(newUser);
      const newNewUser = { ...newUser, id };
      setUser(newNewUser);
      sessionStorage.user = JSON.stringify(newNewUser);
    }
  }

  async function startGame() {
    await firebase
      .database()
      .ref(`sessions/${sessionId}`)
      .set({ ...session?.val(), started: true });
  }

  async function openStartModal() {
    onOpen();
    await firebase
      .database()
      .ref(`sessions/${sessionId}`)
      .set({ ...session?.val(), lockedIn: true });
  }

  async function closeStartModal() {
    onClose();
    await firebase
      .database()
      .ref(`sessions/${sessionId}`)
      .set({ ...session?.val(), lockedIn: false });
  }

  async function setName(name) {
    await updateUser({ ...user, name });
  }

  async function joinTeam(team) {
    await updateUser({ ...user, team });
  }

  async function leaveTeam() {
    await updateUser({ ...user, team: "" });
  }

  const sessionExpired =
    timestamp && Math.ceil((Date.now() - timestamp) / 1000 / 60 / 60) > 24;

  if (!sessionLoading && session) {
    if (sessionExpired) {
      cleanupSession(sessionId);
    }
  }

  const loading = sessionLoading || teamsLoading || usersLoading;
  const error = sessionError || teamsError || usersError;

  function renderAlerts() {
    return (
      <>
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>Something went wrong:</AlertTitle>
            <AlertDescription>{error.toString()}</AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" />
          </Alert>
        )}
        {!loading && sessionExpired && (
          <Alert status="warning">
            <AlertIcon />
            <AlertTitle mr={2}>Session Expired</AlertTitle>
          </Alert>
        )}
      </>
    );
  }

  const allSelected =
    !loading &&
    !error &&
    users.every(userSnapshot => !!userSnapshot.val().team);

  return (
    <>
      <Box maxW="md" m="auto" my="10">
        {loading ? (
          <Spinner size="xl" />
        ) : (
          <>
            {renderAlerts()}
            <Heading as="h1" mb={2}>
              Join a team
            </Heading>
            <Text fontSize="xl" mb={5}>
              Choose a name for yourself and join a team.
            </Text>
            {!sessionExpired && !error && (
              <>
                <FormControl>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input
                    id="name"
                    onChange={event => setName(event.value)}
                    value={user.name}
                    isDisabled={!!user.team || !!session?.val().lockedIn}
                  />
                </FormControl>
                {teams.map(snapshot => {
                  const totalUsers = users.reduce(
                    (total, userSnapshot) =>
                      total + Number(userSnapshot.val().team === snapshot.key),
                    0
                  );
                  const maximumUsers = session.val().count;
                  return (
                    <Box
                      key={snapshot.key}
                      maxW="md"
                      rounded="lg"
                      d="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      borderWidth="1px"
                      my="5"
                      pl="5"
                    >
                      <span style={{ fontVariantNumeric: "tabular-nums" }}>
                        {totalUsers}/{maximumUsers}
                      </span>
                      <Text>{snapshot.val().name} team</Text>
                      {user.team && user.team === snapshot.key ? (
                        <Button
                          rightIcon={MdRemove}
                          variantColor="red"
                          w={100}
                          onClick={() => leaveTeam()}
                          isDisabled={!!session?.val().lockedIn}
                        >
                          Leave
                        </Button>
                      ) : (
                        <Button
                          rightIcon={MdAdd}
                          isDisabled={
                            !!user.team ||
                            totalUsers >= maximumUsers ||
                            !!session?.val().lockedIn
                          }
                          variantColor="green"
                          w={100}
                          onClick={() => joinTeam(snapshot.key)}
                        >
                          Join
                        </Button>
                      )}
                    </Box>
                  );
                })}
                {user.admin && (
                  <>
                    <Button onClick={openStartModal} isDisabled={!allSelected}>
                      Start game
                    </Button>{" "}
                    <Modal
                      closeOnOverlayClick={false}
                      closeOnEsc={false}
                      isOpen={isOpen}
                      onClose={onClose}
                    >
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Start the game</ModalHeader>
                        <ModalBody>Are you sure?</ModalBody>

                        <ModalFooter>
                          <Button
                            variantColor="blue"
                            mr={3}
                            onClick={startGame}
                          >
                            Start
                          </Button>
                          <Button variant="ghost" onClick={closeStartModal}>
                            Cancel
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </>
  );
}
