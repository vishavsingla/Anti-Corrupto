import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
	ImageBackground,
	Text,
	View,
	useWindowDimensions,
	Image,
	TouchableOpacity,
	useColorScheme,
} from "react-native";
import { ThemedText } from "./ThemedText";
import {
	AntDesign,
	Feather,
	FontAwesome6,
	MaterialIcons,
} from "@expo/vector-icons";
import { AndroidButton } from "./AndroidButton";
import { router } from "expo-router";

export default function LandCard({
	name = "Singla Farms",
	landIdentificationNumber = "101010",
	landType = "Agricultural",
	area = "40",
	dimensionOfLand = "0x0",
	location = "Bhadson Road",
	status,
	imgUri = "https://rismedia.com/wp-content/uploads/2021/03/luxury_real_estate_1150278000.jpg",
	currentPrice,
	boughtPrice,
	ownerId,
	id,
	web3Id,
	interestsView = false,
	onpres,
}) {
	console.log("landId in Landcard:", id);
	// const { height, width } = useWindowDimensions();
	const theme = useColorScheme();
	const gradient =
		theme === "dark" ? ["#151718ff", "#ffffff00"] : ["#f5faffff", "#ffffff00"];

	return (
		<TouchableOpacity
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
						status,
						web3Id,
					},
				});
			}}
		>
			<ImageBackground
				source={{
					uri: imgUri,
				}}
				style={{
					// width: width,
					// height: width / 2,
					marginHorizontal: 16,
					marginVertical: 8,
					flexDirection: "row",
					borderRadius: 16,
					overflow: "hidden",
					elevation: 5,
				}}
			>
				<LinearGradient
					colors={gradient}
					start={{ x: 0.47, y: 0 }}
					end={{ x: 0.9, y: 0 }}
					style={{
						flex: 1,
						padding: 16,
						gap: 4,
					}}
				>
					<ThemedText type="subtitle" className="pb-1 mr-32">
						{name}
					</ThemedText>
					<ThemedText type="small">
						{landType} ({landIdentificationNumber})
					</ThemedText>
					<ThemedText type="small">
						{area} sqft. ({dimensionOfLand})
					</ThemedText>
					<ThemedText type="small">
						<FontAwesome6 name="location-dot" size={13} color="black" />
						{" " + location}
					</ThemedText>

					{interestsView ? (
						<View
							className="flex-row justify-between items-center mt-4 p-4 rounded-2xl"
							style={{
								elevation: 24,
								backgroundColor: status === "APPROVED" ? "#b2ffe7e1" : "#d8eaffe1",
							}}
						>
							<View className="flex-row items-center">
								<ThemedText type="defaultSemiBold">Status: </ThemedText>
								<ThemedText
									type="link"
									className="pt-0.5"
									style={{ fontSize: 16, fontWeight: "500" }}
								>
									{status}
								</ThemedText>
							</View>

							{status === "APPROVED" ? (
								<View className="flex-row items-center px-4 p-2 gap-2 rounded-full bg-[#0a7da45d]">
									<Text className="font-semibold ">Pay dues</Text>
									<AntDesign name="arrowright" size={20} color="black" />
								</View>
							) : (
								<View className="items-center p-2 rounded-full bg-[#0a7da45d]">
									<AntDesign name="arrowright" size={20} color="black" />
								</View>
							)}
						</View>
					) : (
						<View className="flex-row border-t border-gray-300 mt-2 pt-3 justify-between items-center">
							<TouchableOpacity
								className="flex-row justify-center items-center "
								onPress={() => {
									onpres();
								}}
								activeOpacity={0.4}
							>
								<Image
									source={{
										uri: "https://akm-img-a-in.tosshub.com/aajtak/images/story/202201/sukhbir_singh_badal-sixteen_nine.jpg?size=948:533",
									}}
									style={{
										width: 35,
										height: 35,
										borderRadius: 18,
										borderWidth: 1.5,
										borderColor: "white",
									}}
								/>
								<Image
									source={{
										uri: "https://pbs.twimg.com/profile_images/1172074434712129537/TUPmgKjk_400x400.jpg",
									}}
									style={{
										width: 35,
										height: 35,
										borderRadius: 18,
										borderWidth: 1.5,
										borderColor: "white",
										marginLeft: -10,
									}}
								/>
								<Image
									source={require("../assets/images/profile.png")}
									style={{
										width: 35,
										height: 35,
										borderRadius: 18,
										borderWidth: 1.5,
										borderColor: "white",
										marginLeft: -10,
									}}
								/>
								<View
									style={{
										width: 35,
										height: 35,
										borderRadius: 18,
										borderWidth: 1.5,
										borderColor: "white",
										marginLeft: -10,
										backgroundColor: "#e1e1e1",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<ThemedText style={{ fontSize: 11, textAlign: "center" }}>
										+12
									</ThemedText>
								</View>
							</TouchableOpacity>

							<View className="flex-row gap-3">
								<TouchableOpacity className="p-2 rounded-full bg-[#eeeeeece]">
									<Feather name="heart" size={20} color="black" />
								</TouchableOpacity>

								<TouchableOpacity className="p-2 rounded-full bg-[#eeeeeece]">
									<Feather name="share" size={20} color="black" />
								</TouchableOpacity>
							</View>
						</View>
					)}
				</LinearGradient>
			</ImageBackground>
		</TouchableOpacity>
	);
}
