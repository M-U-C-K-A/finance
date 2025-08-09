"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/home/header"
import { Code } from "@/components/ui/typography"
import { getAuthUser } from "@/lib/auth-helper"
import { Bug } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  const [path, setPath] = useState("")
  const user = getAuthUser()

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPath(window.location.pathname)
    }
  }, [])

  return (
    <div
      className="min-h-screen w-full p-4 text-center"
      style={{
        background:
          "linear-gradient(to bottom, #170A04 0%, #170A04 20%, #400C0C 40%, #CD0E15 70%, #D54334 85%, #BE0C18 100%)",
      }}
    >
      <Header />
      <div className="flex flex-col text-white mt-20 items-center justify-center h-full">
        <Bug size={96} className="mb-12 mt-20" />
        <h1 className="text-6xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-xl">The page you are looking for could not be found.</p>
        {path && (
          <p className="text-2xl mt-4">
            You are currently on:{" "}
            <Code className="bg-black text-xl bg-gray-800/30 px-2 py-1 rounded-md">{path}</Code>
          </p>
        )}
        {user ? (
          <p className="text-2xl mt-4">
            If you are logged in, you can{" "}
            <Link href="/dashboard" className="text-background underline-offset-4 underline">
              go to the dashboard
            </Link>{" "}
            to access more features.
          </p>
        ) : (
          <p className="text-2xl mt-4">
            If you are not logged in, you can{" "}
            <Link href="/signin" className="text-background underline-offset-4 underline">
              sign in
            </Link>{" "}
            to access more features.
          </p>
        )}
      </div>
    </div>
  )
}
