import Web3 from "@/Metamask/WalletConnect";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { router, Slot, Stack } from "expo-router";
import "react-native-reanimated";
import "../global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../util/AuthContext";

export default function RootLayout() {
	const colorScheme = useColorScheme();

	return (
		<Web3>
			<AuthProvider>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
						<Slot />
					</ThemeProvider>
				</GestureHandlerRootView>
			</AuthProvider>
		</Web3>
	);
}
