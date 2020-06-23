import firebase from "./firebase";

export async function trackEvent(sessionId, data) {
  return firebase.database().ref(`sessions/${sessionId}/events`).push({
    data,
    timestamp: Date.now(),
  });
}
