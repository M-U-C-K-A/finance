import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function Unauthorized() {
	return (
		<div className="mx-auto max-w-3xl w-full min-h-full px-4 sm:px-6 lg:max-w-7xl lg:px-8">
			<Alert variant="destructive">
				<AlertTitle>Unauthorized</AlertTitle>
				<AlertDescription>You are not authorized to access this page. <Link href="/signin">go to signin page.</Link></AlertDescription>
			</Alert>
		</div>
	);
}
