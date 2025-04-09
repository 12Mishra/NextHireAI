"use client"

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();

  useEffect(()=>{
    if(status==="loading") return;
  },[session])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-white">
              <Link href="/" className="text-purple-500">
                NextHireAI
              </Link>
            </span>
          </div>

          {session ? (
            <button onClick={()=>signOut()} className="px-4 py-2 rounded-lg text-white bg-purple-600 transition-colors duration-200">
              Log out
            </button>
          ) : (
            <div className="space-x-4">
              {" "}
              <button className="px-4 py-2 rounded-lg text-white border-purple-500 transition-colors duration-200">
                <Link href="/auth/login">Log in</Link>
              </button>
              <button className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200">
                <Link href="/auth/signup">Sign up</Link>
              </button>{" "}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
