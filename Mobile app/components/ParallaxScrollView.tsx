import type { PropsWithChildren, ReactElement } from "react";
import { ColorValue, StyleSheet, useColorScheme } from "react-native";
import Animated, {
	interpolate,
	useAnimatedRef,
	useAnimatedStyle,
	useScrollViewOffset,
} from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
	headerImage: ReactElement;
	headerBackgroundColor: { dark: string; light: string };
	bgColor: ColorValue;
	elevation: number;
	headerContentHeight: number;
}>;

export default function ParallaxScrollView({
	children,
	headerImage,
	headerBackgroundColor,
	bgColor = "white",
	elevation = 20,
	headerContentHeight = 250,
}: Props) {
	const colorScheme = useColorScheme() ?? "light";
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollViewOffset(scrollRef);

	const headerAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: interpolate(
						scrollOffset.value,
						[-HEADER_HEIGHT, 0, HEADER_HEIGHT],
						[-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
					),
				},
				{
					scale: interpolate(
						scrollOffset.value,
						[-HEADER_HEIGHT, 0, HEADER_HEIGHT],
						[2, 1, 1]
					),
				},
			],
		};
	});

	return (
		<ThemedView style={{ flex: 1, backgroundColor: bgColor }}>
			<Animated.ScrollView
				showsVerticalScrollIndicator={false}
				ref={scrollRef}
				scrollEventThrottle={16}
			>
				<Animated.View
					style={[
						{
							height: headerContentHeight,
							overflow: "hidden",
							marginBottom: -30,
							backgroundColor: headerBackgroundColor[colorScheme],
						},
						headerAnimatedStyle,
					]}
				>
					{headerImage}
				</Animated.View>
				<ThemedView
					style={{
						flex: 1,
						// padding: 32,
						borderTopRightRadius: 32,
						borderTopLeftRadius: 32,
						gap: 16,
						overflow: "hidden",
						elevation: elevation,
					}}
				>
					{children}
				</ThemedView>
			</Animated.ScrollView>
		</ThemedView>
	);
}
