import React from "react";
import {
  Heading,
  Text,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/core";

export default function Page({
  heading,
  subHeading,
  children,
  alertStatus = "info",
  alertTitle,
  alertDescription,
}) {
  return (
    <Box my="10" maxW="md" mx="auto">
      {alertTitle && alertDescription && (
        <Alert status={alertStatus}>
          <AlertIcon />
          <AlertTitle mr={2}>{alertStatus.toString()}</AlertTitle>
          <AlertDescription>{alertDescription.toString()}</AlertDescription>
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
