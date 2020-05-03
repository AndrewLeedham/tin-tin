import React from "react";
import { Heading, Text, Box } from "@chakra-ui/core";
import Header from "./Header";

export default function Page({ header, heading, subHeading, children }) {
  return (
    <Box position="relative" my="10" maxW="md" mx="auto" px="4">
      {header && <Header />}
      {heading && (
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
    </Box>
  );
}
