"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Car, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log("[v0] Password reset requested for:", email)
      setIsLoading(false)
      setIsSuccess(true)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

      <Card className="w-full max-w-md glass-card relative z-10">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-2">
            <Car className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">Reset your password</CardTitle>
          <CardDescription className="text-base">
            {isSuccess
              ? "Check your email for reset instructions"
              : "Enter your email and we'll send you reset instructions"}
          </CardDescription>
        </CardHeader>

        {!isSuccess ? (
          <form onSubmit={handleReset}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="agent@dealership.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
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
                We've sent password reset instructions to <span className="font-medium text-foreground">{email}</span>
              </p>
            </CardContent>

            <CardFooter>
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full h-11 text-base font-medium bg-transparent">
                  Return to login
                </Button>
              </Link>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}
