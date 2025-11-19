"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Car, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/lib/stores/auth-store"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const { resetPassword, loading } = useAuthStore()
  const [email, setEmail] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email) {
      setError("Por favor ingresa tu email")
      return
    }

    const result = await resetPassword(email)

    if (result.error) {
      setError(result.error)
    } else {
      setIsSuccess(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

      <Card className="w-full max-w-md glass-card relative z-10">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-2">
            <Car className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">Restablecer contraseña</CardTitle>
          <CardDescription className="text-base">
            {isSuccess
              ? "Revisa tu correo para las instrucciones de restablecimiento"
              : "Ingresa tu email y te enviaremos las instrucciones para restablecer tu contraseña"}
          </CardDescription>
        </CardHeader>

        {!isSuccess ? (
          <form onSubmit={handleReset}>
            <CardContent className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="agent@dealership.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError(null)
                  }}
                  required
                  className="h-11"
                  disabled={loading}
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full h-11 text-base font-medium" disabled={loading}>
                {loading ? "Enviando..." : "Enviar enlace de restablecimiento"}
              </Button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio de sesión
              </Link>
            </CardFooter>
          </form>
        ) : (
          <>
            <CardContent className="flex flex-col items-center py-8">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <p className="text-center text-muted-foreground">
                Hemos enviado las instrucciones de restablecimiento a <span className="font-medium text-foreground">{email}</span>
              </p>
            </CardContent>

            <CardFooter>
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full h-11 text-base font-medium bg-transparent">
                  Volver al inicio de sesión
                </Button>
              </Link>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}
