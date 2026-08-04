import React from "react";
import { useNavigate } from "react-router";

import { Button } from "#/components/ui/button";
import { Field, FieldControl, FieldLabel } from "#/components/ui/field";
import { Fieldset, FieldsetLegend } from "#/components/ui/fieldset";
import { Input } from "#/components/ui/input";
import { useAuth } from "#/contexts/auth";

export function Auth(): React.ReactNode {
	const navigate = useNavigate();
	const { login, register } = useAuth();
	const [mode, setMode] = React.useState<"login" | "register">("login");
	const [error, setError] = React.useState("");
	const [loading, setLoading] = React.useState(false);
	const nameRef = React.useRef<HTMLInputElement>(null);
	const emailRef = React.useRef<HTMLInputElement>(null);
	const passwordRef = React.useRef<HTMLInputElement>(null);

	const submit = async (
		e: React.SyntheticEvent<HTMLFormElement>,
	): Promise<void> => {
		e.preventDefault();
		setError("");
		setLoading(true);

		const err =
			mode === "login"
				? await login(emailRef.current!.value, passwordRef.current!.value)
				: await register(
						nameRef.current!.value,
						emailRef.current!.value,
						passwordRef.current!.value,
					);

		setLoading(false);

		if (err) {
			setError(err);
			return;
		}

		void navigate("/");
	};

	const toggleMode = (): void => {
		setMode((m) => (m === "login" ? "register" : "login"));
		setError("");
	};

	return (
		<div className="flex min-h-dvh items-center justify-center p-4">
			<form
				onSubmit={(e) => {
					void submit(e);
				}}
				className="flex w-full max-w-sm flex-col gap-4"
			>
				<Fieldset className="flex flex-col gap-4">
					<FieldsetLegend className="font-heading text-2xl">
						{mode === "login" ? "Sign in" : "Create account"}
					</FieldsetLegend>

					{mode === "register" && (
						<Field>
							<FieldLabel>Name</FieldLabel>
							<FieldControl
								render={
									<Input
										ref={nameRef}
										type="text"
										required
										autoComplete="name"
									/>
								}
							/>
						</Field>
					)}

					<Field>
						<FieldLabel>Email</FieldLabel>
						<FieldControl
							render={
								<Input
									ref={emailRef}
									type="email"
									required
									autoComplete="email"
								/>
							}
						/>
					</Field>

					<Field>
						<FieldLabel>Password</FieldLabel>
						<FieldControl
							render={
								<Input
									ref={passwordRef}
									type="password"
									required
									autoComplete={
										mode === "login" ? "current-password" : "new-password"
									}
								/>
							}
						/>
						{error && (
							<p className="text-destructive-foreground text-xs">{error}</p>
						)}
					</Field>
				</Fieldset>

				<Button
					type="submit"
					loading={loading}
				>
					{mode === "login" ? "Sign in" : "Register"}
				</Button>

				<Button
					type="button"
					variant="ghost"
					onClick={toggleMode}
				>
					{mode === "login"
						? "Don't have an account? Register"
						: "Already have an account? Sign in"}
				</Button>
			</form>
		</div>
	);
}
