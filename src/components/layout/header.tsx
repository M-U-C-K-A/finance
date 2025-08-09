import { ThemeToggle } from "../theme/theme-mode-toggle";
import { SidebarTrigger } from "../ui/sidebar";

export function Header()
{
	return (
		<div className="flex items-center justify-between px-4 py-2 border-b border-accent gap-2">

            <SidebarTrigger/>
			<p>Header</p>
			<div className="flex-1"></div>
			<ThemeToggle />
		</div>
	)
}
