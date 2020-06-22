import React from "react";
import { Stack, Heading, Image } from "@chakra-ui/core";

export default function Header({ heading = "Tin-tin" }) {
  return (
    <Stack align="center" marginBottom={10}>
      <Image size="150px" src={`${process.env.PUBLIC_URL}/logo512.png`} />
      <Heading>{heading}</Heading>
    </Stack>
  );
}
