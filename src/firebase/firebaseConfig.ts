const apiKey = process.env.REACT_APP_API_KEY;
if (!apiKey) {
  throw new Error("Empty apiKey, Check .env");
}
const projectId = process.env.REACT_APP_PROJECT_ID;
if (!projectId) {
  throw new Error("Empty projectId, Check .env");
}
const databaseURL = process.env.REACT_APP_BASEURL;
if (!databaseURL) {
  throw new Error("Empty databaseURL, Check .env");
}
const authDomain = process.env.REACT_APP_AUTHDOMAIN;
if (!authDomain) {
  throw new Error("Empty authDomain, Check .env");
}
const storageBucket = process.env.REACT_APP_STORAGEBUCKET;
if (!storageBucket) {
  throw new Error("Empty storageBucket, Check .env");
}
const messagingSenderId = process.env.REACT_APP_MESSAGING_SENDER_ID;
if (!messagingSenderId) {
  throw new Error("Empty messagingSenderId, Check .env");
}

const firebaseConfig = {
  apiKey: apiKey,
  projectId: projectId,
  databaseURL: databaseURL,
  authDomain: authDomain,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
};

export { firebaseConfig };
