const {setGlobalOptions} = require("firebase-functions/v2");
const {beforeUserSignedIn} = require("firebase-functions/v2/identity");
const logger = require("firebase-functions/logger");
const {initializeApp} = require("firebase-admin/app");

initializeApp();

setGlobalOptions({maxInstances: 10});

// Add the role claim Supabase expects before Firebase issues the ID token.
exports.addAuthenticatedRole = beforeUserSignedIn((event) => {
  const user = event.data;

  if (!user) {
    logger.error("No user data found in beforeUserSignedIn event.");
    return {};
  }

  logger.info(`Adding authenticated role for user ${user.uid}`);

  return {
    customClaims: {
      role: "authenticated",
    },
  };
});
