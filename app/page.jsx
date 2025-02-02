"use client";
import { auth, onAuthStateChanged, signInWithGoogle } from "@/lib/firebase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function App() {
  const router = useRouter()
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        router.push("/home");
      }
    });

    return () => unsubscribe();
  }, [router]);
  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        router.push("/home"); 
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <div className="flex min-h-screen md:justify-between justify-center">
      <div className="flex flex-col   md:ml-20 md:items-start items-center justify-center ">
        <h1 className="text-[#7B1984] line flex mb-2 items-center font-bold text-2xl">
          <Image src="/tasklogo.svg" height={32} width={32} alt="logo" />
          TaskBuddy</h1>
        <p className="text-xs w-[310px] text-center md:text-left text-gray-600 mb-6  ">
          Streamline your workflow and track progress effortlessly with our all-in-one task management app.
        </p>
        {user ? (
          <p>Redirecting...</p>
        ) : (
          <button
            onClick={handleLogin}
            className="md:w-[360px] bg-zinc-900 flex gap-2 px-6 z-10 items-center justify-center text-lg hover:bg-zinc-800 text-white py-3 rounded-2xl"
          >
            <Image src="/google.svg" height={20} width={20} alt="google" />
            Continue with Google
          </button>
        )}
      </div>
      <div className="flex md:hidden">
        <Image src="/mobile_bg.svg" alt="bg" layout="fill" objectFit="cover" />
      </div>
      <div className="hidden md:flex">
        <Image src="/circles_bg.svg" alt="bg" width={680} height={680} objectFit="cover" />
        <div className=" absolute top-1/2 right-[0px] transform -translate-y-1/2">
          <Image src="/taskview.jpg" alt="Overlapping Image" width={550} height={550} />
        </div>

      </div>

    </div>
  );
}
