// app/auth/forgot-password/page.tsx
"use client"

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Header } from "@/components/home/header"

export default function ForgotPasswordPage() {
	return (
		<main>
<Header />
		<Card className="mx-4 w-full max-w-screen-2xl w-auto">
			<CardHeader>
				<CardTitle>Forgot your password?</CardTitle>
				<CardDescription>Enter your email to reset your password</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<div className="grid grid-cols-2 gap-4"></div>
					<div className="grid grid-cols-2 gap-4">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" />
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button>Submit</Button>
			</CardFooter>
		</Card>

		</main>
		)
}
