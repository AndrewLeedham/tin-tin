import React from "react";
import { Button } from "@chakra-ui/core";

export default function Waiting({ startTurn }) {
  return <Button onClick={startTurn}>Start Turn</Button>;
}
