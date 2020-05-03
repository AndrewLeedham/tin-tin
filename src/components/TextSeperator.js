import React from "react";
import { Divider, Box, Text } from "@chakra-ui/core";

export default function TextSeperator({ text, ...props }) {
  return (
    <Box position="relative" {...props}>
      <Divider borderColor="gray.400" />
      <Text
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        backgroundColor="white"
        paddingX={2}
      >
        {text}
      </Text>
    </Box>
  );
}
