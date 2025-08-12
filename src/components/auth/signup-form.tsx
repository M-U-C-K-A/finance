"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signUp } from "@/lib/auth-client"
import { toast } from "sonner"
import { RequiredIndicator } from "../ui/required-indicator"
import { Lock, Mail, User } from "lucide-react"

export function SignUpForm() {
  const router = useRouter()
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof SignUpSchema>) {
    await signUp.email({
      email: values.email,
      name: values.name,
      password: values.password,
    },
    {
      onSuccess: () => {
        toast.success("Account created successfully")
        router.push("/dashboard")
      },
      onError: (error) => {
        toast.error(error.error.message)
      },
    })
  }

  return (
      <div><div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
          Create your account
        </h2>
        <p className="text-muted-foreground mt-2">
          Join us to get started
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Name <RequiredIndicator />
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your name" 
                    {...field} 
                    className="pl-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email <RequiredIndicator />
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Password <RequiredIndicator />
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Must be at least 8 characters with at least one letter and one number
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full mt-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
          >
            Create Account
          </Button>
        </form>
      </Form>
	  </div>
  )
}

const SignUpSchema = z.object({
  email: z.string()
    .min(1, { message: "Email is required" })
    .max(50, { message: "Email must be at most 50 characters" })
    .email({ message: "Invalid email" })
    .regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(30, { message: "Name must be at most 30 characters" })
    .regex(/^[a-zA-Z0-9 ]+$/),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(50, { message: "Password must be at most 50 characters" })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,50}$/),
})
