import { requireAuth } from "@/lib/auth-helper";

export default async function Private() {
	await requireAuth();
	return (
		<div className="mx-auto max-w-3xl w-full min-h-full px-4 sm:px-6 lg:max-w-7xl lg:px-8">
			<h1>Only Login People !</h1>
			<p>This is a private page</p>
			<ul>
				<li><a href="/api/auth/signout">Sign Out</a></li>
				<li><a href="/api/auth/signin">Sign In</a></li>
				<li><a href="/api/auth/session">Session</a></li>
				<li><a href="/api/auth/callback">Callback</a></li>
				<li><a href="/api/auth/providers">Providers</a></li>
			</ul>
		</div>
	);
}
