import { View, Text, TextInput, useColorScheme } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import LandCard from "../../components/LandCard";
import { ThemedText } from "../../components/ThemedText";
import ParallaxScrollView from "../../components/ParallaxScrollView";
import {
	AntDesign,
	Feather,
	FontAwesome,
	FontAwesome5,
	FontAwesome6,
	Ionicons,
	MaterialCommunityIcons,
	MaterialIcons,
} from "@expo/vector-icons";
import { AndroidButton } from "../../components/AndroidButton";
import { FlashList } from "@shopify/flash-list";
import LandBuyersSheet from "../../components/LandBuyersSheet";
import { useAuth } from "../../util/AuthContext";
import { getAllLands } from "../../util/LandApi";
import MarketCard from "../../components/MarketCard";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { ScrollView } from "react-native-gesture-handler";
import { ThemedView } from "../../components/ThemedView";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";


export default function Marketplace() {
	const [allLands, setLands] = useState([]);

	const Spacer = ({ height = 16 }) => <MotiView style={{ height }} />;
	const color = useColorScheme();
	const colorMode = color == "dark" ? "dark" : "light";

	useEffect(() => {
		const getLands = async () => {
			const lands = await getAllLands();
			setLands(lands);
			console.log("Market : ", lands);
		};

		getLands();
	}, []);

	return (
		<>
			<StatusBar style="dark" />
			<ParallaxScrollView
				headerContentHeight={500}
				elevation={0}
				headerBackgroundColor={{ light: "#ffffff", dark: "#353636" }}
				headerImage={
					<ThemedView className="flex-1 pt-10">
						<View className="flex-row">
							<AndroidButton
								onPress={() => router.back()}
								className="rounded-full m-4 bg-gray-100  border-gray-300"
								rippleColor="#b0b0b0ff"
							>
								<Ionicons name="arrow-back-outline" size={24} color="black" />
							</AndroidButton>
						</View>

						<ThemedText type="title" className="px-7 pt-4">
							Find the
						</ThemedText>
						<ThemedText type="title" className="p-7 pt-2 pb-3">
							perfect place.
						</ThemedText>

						<View className="flex-row gap-3 m-4">
							<View className="flex-row flex-1 items-center gap-2  border-gray-100 bg-gray-100 px-4 py-2 rounded-full my-2">
								<AntDesign name="search1" size={17} color="gray" />
								<TextInput placeholder="Search" className="flex-1" />
							</View>
							<AndroidButton
								className="bg-blue-500 rounded-full my-2"
								rippleColor="#025ecf"
							>
								<View className="flex-row items-center gap-2 px-1">
									<FontAwesome name="sort" size={18} color="white" />
									<Text className="text-white">Sort</Text>
								</View>
							</AndroidButton>
						</View>

						<ThemedText type="defaultSemiBold" className="p-7 pt-2 pb-4">
							Categories
						</ThemedText>

						<View>
							<ScrollView showsHorizontalScrollIndicator={false} horizontal>
								<View className="mx-2" />
								<View className="items-center justify-center mx-3 gap-2">
									<AndroidButton
										// rippleColor="#b0b0b0ff"
										className="rounded-full bg-indigo-600"
									>
										<Ionicons name="home" size={28} color="white" />
									</AndroidButton>
									<ThemedText style={{ fontSize: 12 }}>Residential</ThemedText>
								</View>

								<View className="items-center justify-center mx-3 gap-2">
									<AndroidButton
										rippleColor="#ff6161ff"
										className="rounded-full bg-orange-400"
									>
										<MaterialCommunityIcons
											name="office-building-marker"
											size={28}
											color="white"
										/>
									</AndroidButton>
									<ThemedText style={{ fontSize: 12 }}>Commercial</ThemedText>
								</View>

								<View className="items-center justify-center mx-3 gap-2">
									<AndroidButton
										// rippleColor="#b0b0b0ff"
										className="rounded-full bg-green-700"
									>
										<MaterialCommunityIcons
											name="tractor-variant"
											size={28}
											color="white"
										/>
									</AndroidButton>
									<ThemedText style={{ fontSize: 12 }}>Agricultural</ThemedText>
								</View>

								<View className="items-center justify-center mx-3 gap-2">
									<AndroidButton
										// rippleColor="#b0b0b0ff"
										className="rounded-full bg-primaryBlue"
									>
										<FontAwesome6 name="building-columns" size={28} color="white" />
									</AndroidButton>
									<ThemedText style={{ fontSize: 12 }}>Government</ThemedText>
								</View>

								<View className="items-center justify-center mx-3 gap-2">
									<AndroidButton
										rippleColor="#7f0000ff"
										className="rounded-full bg-red-500"
									>
										<FontAwesome5 name="industry" size={28} color="white" />
									</AndroidButton>
									<ThemedText style={{ fontSize: 12 }}>Industrial</ThemedText>
								</View>

								<View className="mx-4" />
							</ScrollView>
						</View>
					</ThemedView>
				}
			>
				{allLands.length == 0 ? (
					<MotiView
						transition={{
							type: "timing",
						}}
						style={{
							flex: 1,
							padding: 16,
							justifyContent: "center",
							alignItems: "center",
						}}
						animate={{ backgroundColor: "#ffffff" }}
					>
						<Skeleton colorMode={colorMode} radius="round" height={75} width={75} />
						<Spacer />
						<Skeleton colorMode={colorMode} width={250} />
						<Spacer height={8} />
						<Skeleton colorMode={colorMode} width={"100%"} />
						<Spacer height={8} />
						<Skeleton colorMode={colorMode} width={"100%"} />
					</MotiView>
				) : (
					<View style={{ flex: 1, paddingTop: 8 }}>
						<ThemedText type="defaultSemiBold" className="p-7 pb-5 pt-0">
							Featured
						</ThemedText>

						<FlashList
							horizontal
							data={allLands}
							showsHorizontalScrollIndicator={false}
							renderItem={({ item }) => (
								<MarketCard
									cardSize="small"
									{...item}
								/>
							)}
							estimatedItemSize={10}
							keyExtractor={(item, index) => index.toString()}
							ListFooterComponent={<View style={{ width: 20 }} />}
							ListHeaderComponent={<View style={{ width: 16 }} />}
						/>

						<ThemedText type="defaultSemiBold" className="p-7 pb-5 mt-2">
							Explore
						</ThemedText>

						<FlashList
							data={allLands}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ paddingHorizontal: 16 }}
							renderItem={({ item }) => (
								<MarketCard
									cardSize="large"
									{...item}
								/>
							)}
							estimatedItemSize={10}
							keyExtractor={(item, index) => index.toString()}
							ListFooterComponent={<View style={{ height: 20 }} />}
						/>
					</View>
				)}
			</ParallaxScrollView>
		</>
	);
}
