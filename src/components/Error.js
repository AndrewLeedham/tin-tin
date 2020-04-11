import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/core";

export default function Error({ title, description }) {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle mr={2}>{title}</AlertTitle>
      <AlertDescription>{description.toString()}</AlertDescription>
      <CloseButton position="absolute" right="8px" top="8px" />
    </Alert>
  );
}
