import React from "react";
import {
  Heading,
  Text,
  Box,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/core";
import Header from "./Header";
import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import { footer, page } from "./Page.module.css";

export default function Page({
  header,
  heading,
  subHeading,
  children,
  showLeave,
}) {
  const [isOpen, setIsOpen] = React.useState();
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();
  return (
    <>
      <Box
        className={page}
        position="relative"
        py="10"
        maxW="md"
        mx="auto"
        px="4"
      >
        <div>
          {header && <Header heading={heading} />}
          {heading && !header && (
            <Heading as="h1" mb={2}>
              {heading}
            </Heading>
          )}
          {subHeading && (
            <Text fontSize="xl" mb={5}>
              {subHeading}
            </Text>
          )}
          {children}
        </div>

        {showLeave && (
          <footer className={footer}>
            <IconButton
              onClick={() => setIsOpen(true)}
              aria-label={"Leave session"}
              icon={FiLogOut}
              variant="outline"
              variantColor={"red"}
              mt={10}
            />
          </footer>
        )}
      </Box>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Leave session
          </AlertDialogHeader>

          <AlertDialogBody>Are you sure you want to leave?</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button as={Link} to="/" variantColor="red" ml={3}>
              Leave session
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
