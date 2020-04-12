import { useState } from "react";

export const USERSTATE = {
  SUBMITTING: 0,
  PLAYING: 1,
  WAITING: 2,
};

function getUserFromSession(sessionId) {
  const raw = sessionStorage.getItem("user");
  if (raw) {
    try {
      const user = JSON.parse(raw);
      if (sessionId && user.sessionId !== sessionId) {
        return undefined;
      }
      return user;
    } catch (e) {
      console.warn("Could not read user from local session: ", e);
      return undefined;
    }
  }
  return undefined;
}

function createUser(sessionId, admin = false) {
  const user = {
    sessionId,
    admin,
    state: USERSTATE.SUBMITTING,
    names: undefined,
  };

  sessionStorage.setItem("user", JSON.stringify(user));

  return user;
}

export default function useUser(sessionId = null) {
  const [user, setUser] = useState(
    () =>
      (sessionId && getUserFromSession(sessionId)) ||
      createUser(sessionId, !sessionId)
  );

  function updateUser(user) {
    sessionStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  }

  return [user, updateUser];
}
