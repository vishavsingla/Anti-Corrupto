import "@walletconnect/react-native-compat";
import { WagmiProvider } from "wagmi";
import { sepolia } from "@wagmi/core/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createAppKit,
	defaultWagmiConfig,
	AppKit,
} from "@reown/appkit-wagmi-react-native";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId at https://cloud.reown.com
const projectId = "a5494817367ce66295c9e044e75f0155";

// 2. Create config
const metadata = {
	name: "AppKit RN",
	description: "AppKit RN Example",
	url: "https://reown.com/appkit",
	icons: ["https://avatars.githubusercontent.com/u/179229932"],
	redirect: {
		native: "YOUR_APP_SCHEME://",
		universal: "YOUR_UNIVERSAL_LINK.com",
	},
};

const chains = [sepolia] as const;

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createAppKit({
	projectId,
	wagmiConfig,
	defaultChain: sepolia, // Optional
	enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

import { ReactNode } from "react";

export default function Web3({ children }: { children: ReactNode }) {
	return (
		<WagmiProvider config={wagmiConfig}>
			<QueryClientProvider client={queryClient}>
				{children}
				<AppKit />
			</QueryClientProvider>
		</WagmiProvider>
	);
}
