import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "interview-ai-f9bcd.firebaseapp.com",
  projectId: "interview-ai-f9bcd",
  storageBucket: "interview-ai-f9bcd.firebasestorage.app",
  messagingSenderId: "237125808150",
  appId: "1:237125808150:web:156e1af849ca23da804537"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // console.log("Persistence enabled");
  })
  .catch((err) => console.log(err));

export { auth, provider };
