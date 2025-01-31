import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup,onAuthStateChanged } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBZGK6jHQxsTj0ALsuvM6JA2KM3j142Mr0",
  authDomain:`${"taskbuddy-4dbd0"}.firebaseapp.com`,
  projectId: "taskbuddy-4dbd0",
 
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
    
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User Info:", result.user);
   return result.user
  } catch (error) {
    console.error("Error signing in:", error);
  }
};

export { auth, signInWithGoogle,onAuthStateChanged };
