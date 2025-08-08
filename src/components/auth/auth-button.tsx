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
			<Button variant="outline" className="max-w-xs truncate">
				{user.email}
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end" className="w-48">
			<DropdownMenuItem className="p-0">
				<form className="w-full">
					<Button
						formAction={async () => {
							"use server";
							await signOut();
							revalidatePath("/");
						}}
						variant="ghost"
						size="sm"
						className="w-full justify-start"
					>
						Sign Out
					</Button>
				</form>
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
	)
}
