import { useState } from "react";

export const USERSTATE = {
  SUBMITTING: 0,
  PLAYING: 1,
  WAITING: 2,
};

function getUserFromSession() {
  const raw = sessionStorage.getItem("user");
  if (raw) {
    try {
      const user = JSON.parse(raw);
      return user;
    } catch (e) {
      console.warn("Could not read user from local session: ", e);
      return undefined;
    }
  }
  return undefined;
}

function createUser(admin = false) {
  const user = {
    admin,
    state: USERSTATE.SUBMITTING,
    names: undefined,
  };

  sessionStorage.setItem("user", JSON.stringify(user));

  return user;
}

export default function useUser(admin = false) {
  const [user, setUser] = useState(getUserFromSession() || createUser(admin));

  function updateUser(user) {
    sessionStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  }

  function updateUserState(newState) {
    const newUser = { ...user };
    newUser.state = newState;
    updateUser(newUser);
  }

  async function startUserTurn(names) {
    const newUser = { ...user };
    newUser.state = USERSTATE.PLAYING;
    newUser.names = names;
    updateUser(newUser);
  }

  return [user, updateUserState, startUserTurn];
}
