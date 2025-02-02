import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup,onAuthStateChanged } from "firebase/auth";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
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
