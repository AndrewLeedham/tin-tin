import React from "react";
import { Heading, Text, Box } from "@chakra-ui/core";

export default function Page({ heading, subHeading, children }) {
  return (
    <Box my="10" maxW="md" mx="auto">
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
