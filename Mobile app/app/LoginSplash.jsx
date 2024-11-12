import React from "react";
import {
	ImageBackground,
	Pressable,
	Text,
	View,
	StyleSheet,
	Image,
} from "react-native";
import PrimaryButton from "../components/primaryButton";
import Colors from "../components/Colors";
import { router } from "expo-router";

export default function LoginSplash() {
	return (
		<ImageBackground
			source={require("../assets/images/Splash02.png")}
			resizeMode="cover"
			className="flex-1"
		>
			<View className="flex-1 justify-between items-center p-8">
				<Image
					source={require("../assets/images/logo.png")}
					style={{ width: 200, height: 200, marginTop: 150 }}
				/>
				<View className=" w-full mb-8">
					<View className=" rounded-xl mb-4 w-full overflow-hidden">
						<Pressable
							className=" bg-white py-3 "
							android_ripple={{ color: "hsla(215, 100%, 50%, 0.368)" }}
							onPress={() => {
								router.navigate("/Login");
							}}
						>
							<Text
								className=" text-center font-bold text-base "
								style={{ color: Colors.primaryBlue }}
							>
								Login
							</Text>
						</Pressable>
					</View>
					<PrimaryButton
						onPress={() => {
							router.navigate("/SignUp");
						}}
						outer={styles.border}
					>
						Sign up
					</PrimaryButton>
				</View>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	border: {
		borderWidth: 2,
		borderColor: "white",
	},
});
