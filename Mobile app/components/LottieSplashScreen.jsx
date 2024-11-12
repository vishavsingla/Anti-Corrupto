import React, { useEffect } from "react";
import { View, useColorScheme } from "react-native";
import LottieView from "lottie-react-native";
import { Colors } from "@/constants/Colors";

const LottieSplashScreen = () => {
	// Automatically finish after the animation is done
	// useEffect(() => {
	// 	const timer = setTimeout(onAnimationFinish); // Adjust timing based on your animation duration
	// 	return () => clearTimeout(timer);
	// }, [onAnimationFinish]);
	const theme = useColorScheme();

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor:
					theme === "dark" ? Colors.dark.background : Colors.light.background,
			}}
		>
			<LottieView
				source={require("../assets/lotties/pulse.json")} // Path to your animation file
				autoPlay
				loop={true}
				style={{
					width: 300,
					height: 300,
				}}
			/>
		</View>
	);
};

export default LottieSplashScreen;
