"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useEffect } from "react"

export default function Unauthorized() {
  useEffect(() => {
    const url = window.location.href
    toast.error("Accès refusé", {
      description: `Vous n'avez pas les autorisations nécessaires pour accéder à cette page: ${url}`,
      duration: 5000,
    })
  }, [])

  return (
    <div className="mx-auto max-w-3xl w-full h-full px-4 sm:px-6 lg:max-w-7xl lg:px-8 flex flex-col justify-center">
      <Alert variant="destructive" className="mt-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Accès non autorisé</AlertTitle>
        </div>
        <AlertDescription className="mt-2">
          <p className="mb-3">Vous n'avez pas les permissions requises pour visualiser cette page.</p>
          <Link 
            href="/auth" 
            className="text-primary hover:text-primary/90 underline-offset-4 underline flex gap-2 items-center w-fit"
          >
            Se connecter
            <ArrowRight size={16} />
          </Link>
        </AlertDescription>
      </Alert>
    </div>
  )
}
