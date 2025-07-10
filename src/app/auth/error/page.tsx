"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
    const searchParams = useSearchParams()
    const error = searchParams.get("error")

    const getErrorMessage = (error: string | null) => {
        switch (error) {
            case "Configuration":
                return "There is a problem with the server configuration."
            case "AccessDenied":
                return "You do not have permission to sign in."
            case "Verification":
                return "The verification token has expired or has already been used."
            case "Default":
            default:
                return "An error occurred during authentication."
        }
    }

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <Card>
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex justify-center mb-4">
                            <AlertCircle className="h-12 w-12 text-red-500" />
                        </div>
                        <CardTitle className="text-2xl">Authentication Error</CardTitle>
                        <CardDescription>
                            {getErrorMessage(error)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center space-y-2">
                            <Button asChild className="w-full">
                                <Link href="/auth/signin">
                                    Try Again
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="w-full">
                                <Link href="/">
                                    Go Home
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 