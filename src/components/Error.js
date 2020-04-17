import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/core";

export default function Error({ error }) {
  return (
    <Alert
      status="error"
      variant="subtle"
      flexDirection="column"
      justifyContent="center"
      textAlign="center"
      height="200px"
    >
      <AlertIcon size="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        Something went wrong
      </AlertTitle>
      <AlertDescription maxWidth="sm">{error}</AlertDescription>
    </Alert>
  );
}
