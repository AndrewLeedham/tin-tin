import React from "react";
import { Heading, Text, Box, IconButton } from "@chakra-ui/core";
import Header from "./Header";
import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Page({
  header,
  heading,
  subHeading,
  children,
  showLeave,
}) {
  return (
    <Box position="relative" my="10" maxW="md" mx="auto" px="4">
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

      {showLeave && (
        <IconButton
          as={Link}
          to="/"
          aria-label={"Leave session"}
          icon={FiLogOut}
          variant="outline"
          variantColor={"red"}
          mt={10}
        />
      )}
    </Box>
  );
}
