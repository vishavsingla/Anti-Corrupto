import React, { useReducer } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
	ImageBackground,
	Text,
	View,
	useWindowDimensions,
	TouchableOpacity,
	useColorScheme,
	StyleSheet,
	Pressable,
	Image,
} from "react-native";
import { ThemedText } from "./ThemedText";
import {
	AntDesign,
	Feather,
	FontAwesome6,
	Foundation,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import { AndroidButton } from "./AndroidButton";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { ThemedView } from "./ThemedView";
import { router } from "expo-router";

export default function MarketCard({
	name = "Singla farms",
	landType = "Agricultural",
	area = "450 gaj",
	location = "patiala",
	currentPrice = "400000",
	boughtPrice = "500000",
	dimensionOfLand = "400 gaj",
	ownerId = "temp: brokeVshave69",
	id = "temp: 0101010101010101",
	landIdentificationNumber = "temp: 404",
	imgUri = "https://rismedia.com/wp-content/uploads/2021/03/luxury_real_estate_1150278000.jpg",
	cardSize = "large",
}) {
	const { height, width } = useWindowDimensions();
	const theme = useColorScheme();
	const gradient =
		theme === "dark" ? ["#151718ff", "#ffffff00"] : ["#f5faffff", "#ffffff00"];

	const priceDecorator = (price) => {
		const n = price.length;
		for (let i = n - 1; i >= 0; i--) {
			if (i % 2 == 0 && i != 0 && i != n - 1) {
				price = price.slice(0, i) + "," + price.slice(i);
			}
		}
		return price;
	};

	return (
		<View className="flex-1">
			{cardSize === "large" ? (
				<TouchableOpacity
					className="flex-1 mb-8"
					activeOpacity={0.85}
					onPress={() => {
						router.navigate({
							pathname: "/(app)/LandInfo",
							params: {
								name,
								landType,
								area,
								location,
								currentPrice,
								boughtPrice,
								dimensionOfLand,
								ownerId,
								id,
								landIdentificationNumber,
								imgUri,
							},
						});
					}}
				>
					<Image
						source={{ uri: imgUri }}
						width={"100%"}
						height={width / 2}
						borderRadius={16}
						resizeMode="cover"
					/>

					<ThemedText style={{ fontSize: 22, padding: 8, marginTop: 3 }}>
						{name}
					</ThemedText>

					<View className="flex-row flex-wrap gap-2">
						<View className="flex-row p-2 px-3 items-center gap-2 rounded-full bg-gray-200">
							<Foundation name="mountains" size={12} color="#606060" />
							<ThemedText type="small" style={{ fontSize: 12, color: "#606060" }}>
								{landType}
							</ThemedText>
						</View>
						<View className="flex-row p-2 px-3 items-center gap-2 rounded-full bg-gray-200">
							<MaterialCommunityIcons name="axis-arrow" size={12} color="#606060" />
							<ThemedText type="small" style={{ fontSize: 12, color: "#606060" }}>
								{dimensionOfLand}
							</ThemedText>
						</View>
						<View className=" flex-row p-2 px-3 items-center gap-2 rounded-full bg-gray-200">
							<Feather name="map-pin" size={12} color="#606060" />
							<ThemedText type="small" style={{ fontSize: 12, color: "#606060" }}>
								{area}, {location}
							</ThemedText>
						</View>
					</View>

					<ThemedText
						style={{ fontSize: 22, padding: 8, paddingBottom: 4 }}
						type="subtitle"
					>
						₹{priceDecorator(boughtPrice)}
					</ThemedText>
				</TouchableOpacity>
			) : (
				<TouchableOpacity
					className="flex-1 mr-6"
					activeOpacity={0.85}
					onPress={() => {
						router.navigate({
							pathname: "/(app)/LandInfo",
							params: {
								name,
								landType,
								area,
								location,
								currentPrice,
								boughtPrice,
								dimensionOfLand,
								ownerId,
								id,
								landIdentificationNumber,
								imgUri,
							},
						});
					}}
					style={{ width: width / 2 }}
				>
					<Image
						source={{ uri: imgUri }}
						width={width / 2}
						height={width / 2.5}
						borderRadius={16}
						resizeMode="cover"
					/>

					<ThemedText
						style={{
							fontSize: 18,
							paddingHorizontal: 8,
							paddingTop: 8,
							paddingBottom: 2,
							flexWrap: "wrap",
						}}
					>
						{name}
					</ThemedText>

					<View className="flex-row items-center pl-2 justify-start">
						<Feather name="map-pin" size={12} color="#606060" />

						<ThemedText
							style={{ paddingHorizontal: 6, fontSize: 12, color: "#606060" }}
							type="small"
						>
							{area}, {location}
						</ThemedText>
					</View>
				</TouchableOpacity>
			)}
		</View>
	);
}
