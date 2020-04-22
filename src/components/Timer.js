import React, { useState } from "react";
import { IconButton, Text, Flex } from "@chakra-ui/core";
import { FiPause, FiPlay, FiRepeat, FiEye, FiEyeOff } from "react-icons/fi";

function pad(number) {
  const str = number.toString();
  if (str.length === 1) {
    return "0" + str;
  } else {
    return str;
  }
}

export default function Timer({ time, reset, toggle, isPaused, ...props }) {
  const [hidden, setHidden] = useState(false);
  return (
    <Flex
      rounded="md"
      borderWidth={1}
      borderColor="black"
      px={1}
      alignItems="center"
      {...props}
    >
      <IconButton
        size="sm"
        aria-label="Hide timer"
        icon={hidden ? FiEye : FiEyeOff}
        variant="ghost"
        onClick={() => setHidden(!hidden)}
      />
      <Text
        as="span"
        fontSize="md"
        style={{ fontVariantNumeric: "tabular-nums" }}
        opacity={hidden ? 0 : 1}
        mx={2}
      >
        {pad(Math.floor(time / 60))}:{pad(Math.floor(time % 60))}
      </Text>
      <IconButton
        size="sm"
        aria-label={isPaused ? "Resume timer" : "Pause timer"}
        icon={isPaused ? FiPlay : FiPause}
        variant="ghost"
        onClick={() => toggle()}
      />
      <IconButton
        size="sm"
        aria-label="Reset timer"
        icon={FiRepeat}
        variant="ghost"
        onClick={() => reset()}
      />
    </Flex>
  );
}
