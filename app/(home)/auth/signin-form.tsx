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
import { signIn } from "@/lib/auth-client"
import { toast } from "sonner"

const SignIpSchema = z.object({
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

export function SignInForm() {
  const router = useRouter()
  // 1. Define your form.
  const form = useForm<z.infer<typeof SignIpSchema>>({
    resolver: zodResolver(SignIpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignIpSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    await signIn.email({
      email: values.email,
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
    }
  )
  }

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    required
                    {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    required
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Password must be at least 8 characters and contain at least one letter and one number
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
  )
}

