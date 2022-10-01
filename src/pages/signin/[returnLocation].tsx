import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

const SignInRedirect: NextPage = () => {
	const router = useRouter();
	const { returnLocation } = router.query as { returnLocation: string };

	if (returnLocation) {
		// replace - with / in returnLocation
		const returnLocationPath = returnLocation.replace(/-/g, "/");
		const callback = "/" + returnLocationPath;
		signIn("discord", { callbackUrl: callback });
		return <div>Redirecting...</div>;
	}
	return <div>You shouldn&apos;t see this</div>;
};

export default SignInRedirect;
