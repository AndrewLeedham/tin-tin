import firebase from "firebase/app";
import "firebase/database";
const config = {
  apiKey: "AIzaSyDb3dX8j1yMlbNFGHI9QqRpSBjJ0WsWO4I",
  authDomain: "tin-tin-5e0d8.firebaseapp.com",
  databaseURL: "https://tin-tin-5e0d8.firebaseio.com",
  projectId: "tin-tin-5e0d8",
  storageBucket: "tin-tin-5e0d8.appspot.com",
  messagingSenderId: "196227528129",
  appId: "1:196227528129:web:51ad97056e103f78c2ab40"
};
firebase.initializeApp(config);
export default firebase;

export function cleanupSession(id) {
  console.log("cleaning up session");
}
