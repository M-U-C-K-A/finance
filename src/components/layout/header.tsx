import { ModeToggle } from "../theme/theme-mode-toggle";
import { AuthButton } from "../auth/auth-button";

export function Header()
{
	return (
		<div className="flex items-center justify-between px-4 py-2 border-b border-accent gap-2">
			<p>Header</p>
			<div className="flex-1"></div>
			<AuthButton />
			<ModeToggle />
		</div>
	)
}
