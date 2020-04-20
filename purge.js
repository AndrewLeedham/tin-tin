require("dotenv").config();
const firebase = require("./src/firebase");
const ora = require("ora");

(async () => {
  try {
    await firebase
      .auth()
      .signInWithEmailAndPassword(
        process.env.TINTIN_USER,
        process.env.TINTIN_PASS
      );
    const sessions = await firebase.database().ref("sessions").once("value");
    const val = sessions.val();
    if (val) {
      for (const [key, value] of Object.entries(val)) {
        if (!value.timestamp || Date.now() - value.timestamp >= 5184000) {
          const spinner = ora(`Removing session (${key})`);
          await firebase
            .database()
            .ref(`sessions/${key}`)
            .remove((error) => {
              if (error) {
                spinner.fail(`Removing session (${key}) failed`);
                process.exit(1);
              } else {
                spinner.succeed(`Removed session (${key})`);
              }
            });
        }
      }
    }
    console.log("Done");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
