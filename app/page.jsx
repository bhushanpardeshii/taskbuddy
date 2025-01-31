"use client";
import { auth, onAuthStateChanged, signInWithGoogle } from "@/lib/firebase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function App() {
  const router=useRouter()
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        router.push("/home"); // Redirect if user is authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);
  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        router.push("/home"); // Navigate after successful login
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <div className="flex max-h-screen justify-between">
      <div className="flex flex-col ml-20 justify-center items-center">
      <p className="text-sm text-gray-600 mb-6  ">
            Streamline your workflow and track progress effortlessly<br/> with our all-in-one task management app.
          </p>
      {user ? (
        <p>Redirecting...</p>
      ) : (
        <button
          onClick={handleLogin}
          className="w-[240px] bg-zinc-900 text-white hover:bg-zinc-800 text-white py-2 rounded-xl"
        >
          Sign in with Google
        </button>
      )}
      </div>
      <div className="">
        <Image src="/circles_bg.svg" alt="bg"  width={680} height={680}  objectFit="cover"/>
      </div>
      
    </div>
  );
}
