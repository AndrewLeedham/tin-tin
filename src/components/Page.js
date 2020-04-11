import React from "react";
import {
  Heading,
  Text,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton
} from "@chakra-ui/core";

export default function Page({ heading, subHeading, error, children }) {
  return (
    <Box maxW="md" m="auto" my="10">
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>
            Something went wrong creating a new session:
          </AlertTitle>
          <AlertDescription>{error.toString()}</AlertDescription>
          <CloseButton position="absolute" right="8px" top="8px" />
        </Alert>
      )}
      <Heading as="h1" mb={2}>
        {heading}
      </Heading>
      {subHeading && (
        <Text fontSize="xl" mb={5}>
          {subHeading}
        </Text>
      )}
      {children}
    </Box>
  );
}
