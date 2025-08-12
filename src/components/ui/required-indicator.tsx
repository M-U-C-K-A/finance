import { Asterisk } from "lucide-react"
import { Button } from "./button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card"
import Link from "next/link"

function RequiredIndicator() {
return (
	<HoverCard>
		<HoverCardTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-4 h-4 text-red-400 hover:bg-transparent flex flex-col pb-2">
				<Asterisk className="w-[2px] h-[2px]" />
			</Button>
		</HoverCardTrigger>
                    <HoverCardContent className="w-auto p-2 text-xs max-w-[200px]">
			This field is required <br />
			<Link
				href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/required"
				target="_blank"
				className="underline text-primary"
			>
				Need help?
			</Link>
		</HoverCardContent>
	</HoverCard>
)
}
export { RequiredIndicator }
