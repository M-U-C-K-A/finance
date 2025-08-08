import { signOut } from "@/lib/auth"
import { auth } from "@/lib/auth-helper"
import Link from "next/link"
import { Button, buttonVariants } from "../ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu"
import { revalidatePath } from "next/cache"

export async function AuthButton() {
	const user = await auth()
	if (!user) {
		return (
			<Link className={buttonVariants({ variant: "outline" })} href="/signin">
				Sign In
			</Link>
		)
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={"outline"}>{user.email}</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem>
					<form>
						<Button
							formAction={async () => {
								"use server";
								await signOut();
								revalidatePath("/");
							}}
							>
							Sign Out
						</Button>
					</form>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
