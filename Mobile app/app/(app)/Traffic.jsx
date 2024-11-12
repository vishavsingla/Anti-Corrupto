import {
	Image,
	ScrollView,
	Text,
	View,
	TouchableOpacity,
	ToastAndroid,
	useColorScheme,
} from "react-native";
import {
	Ionicons,
	MaterialIcons,
	AntDesign,
	Feather,
	FontAwesome5,
} from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { getUserVehicles } from "../../util/vehicleApi";
import {
	getChallansById,
	getAllChallans,
	deleteChallan,
	getVehicleChallans,
} from "../../util/challanApi";
import { useAuth } from "../../util/AuthContext";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { ExternalLink } from "../../components/ExternalLink";
import { AndroidButton } from "../../components/AndroidButton";
import ChallanCard from "../../components/ChallanCard";
import { MotiView, MotiText } from "moti";
import { Skeleton } from "moti/skeleton";

export default function Traffic() {
	const [vehicles, setVehicles] = useState(null);
	const [challans, setChallans] = useState([]);
	const [focused, setFocused] = useState("");
	const [info, setInfo] = useState(true);

	const colorScheme = useColorScheme();
	const colorMode = colorScheme == "dark" ? "dark" : "light";

	const [activeCardId, setActiveCardId] = useState(null);

	const toggleCard = (challanId) => {
		setActiveCardId((prev) => (prev === challanId ? null : challanId));
	};

	const { userData } = useAuth();

	const getallvehicles = async () => {
		try {
			console.log("fetching vehicles...");
			const myvehicles = await getUserVehicles(userData.id);
			console.log("myvehicles: ", myvehicles);
			setVehicles(myvehicles);
		} catch (error) {
			console.error("Failed to fetch vehicles:", error.message);
			ToastAndroid.show(
				"Failed to fetch vehicles. Please try again.",
				ToastAndroid.SHORT
			);
		}
	};

	const getallChallans = async () => {
		try {
			console.log("fetching challans...");
			const myChallans = await getVehicleChallans();
			console.log("myChallans: ", myChallans);
			setChallans(myChallans);
		} catch (error) {
			console.error("Failed to fetch challans:", error.message);
			ToastAndroid.show(
				"Failed to fetch challans. Please try again.",
				ToastAndroid.SHORT
			);
		}
	};

	const filteredChallans = challans.filter(
		(challan) => challan.vehicleId === focused
	);

	const filteredVehicl = vehicles?.filter((vehicle) => vehicle.id === focused);

	useEffect(() => {
		getallvehicles();
		getallChallans();
	}, []);

	useEffect(() => {
		if (vehicles?.length > 0) {
			setFocused(vehicles[0].id);
		}
	}, [vehicles]);

	return (
		<>
			<View className="flex-1 overflow-hidden justify-between">
				<View className="mb-4 mt-4 gap-8">
					{vehicles == null ? (
						<MotiView
							style={{
								width: "100%",
								paddingHorizontal: 16,
							}}
						>
							<MotiText className="absolute z-10 top-24 left-48 text-lg">
								Loading...
							</MotiText>
							<Skeleton colorMode={colorMode} width={"100%"} height={200} />
						</MotiView>
					) : vehicles.length == 0 ? (
						<View className="py-24 mx-4 rounded-2xl bg-gray-300">
							<ThemedText className="text-center">No Vehicles found...</ThemedText>
						</View>
					) : (
						<ScrollView
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={{ paddingRight: 50 }}
							className="px-3"
						>
							{vehicles.map((vehicle, index) => (
								<TouchableOpacity
									key={index}
									onPress={() => {
										setFocused(vehicle.id);
									}}
									className={
										vehicle.id === focused
											? "rounded-3xl overflow-hidden p-2 mx-2 bg-[#003b93f5] justify-center"
											: "rounded-3xl overflow-hidden p-2 mx-2 bg-[#003b93be] justify-center opacity-50"
									}
								>
									<Image
										source={require("../../assets/images/creta.webp")}
										style={{ height: 150, width: 300, borderRadius: 16 }}
									/>

									<View className="mt-1 flex-row items-center justify-between">
										<Text className="text-start p-2 text-base text-white font-bold">
											{vehicle.model}
										</Text>
										<Text className="text-end p-2 text-base text-white font-bold">
											{vehicle.plateNumber}
										</Text>
									</View>
								</TouchableOpacity>
							))}
						</ScrollView>
					)}

					<View
						className="flex-row p-2 mx-4 justify-evenly rounded-2xl bg-gray-400"
						style={{ elevation: 15 }}
					>
						<TouchableOpacity
							className="flex-1 p-2 items-center justify-center rounded-xl"
							style={{ backgroundColor: info ? "white" : "transparent" }}
							onPress={() => setInfo(true)}
							activeOpacity={0.5}
						>
							<ThemedText type="defaultSemiBold">Info</ThemedText>
						</TouchableOpacity>
						<TouchableOpacity
							className="flex-1 p-2 items-center justify-center rounded-xl"
							style={{ backgroundColor: info ? "transparent" : "white" }}
							onPress={() => setInfo(false)}
							activeOpacity={0.5}
						>
							<ThemedText type="defaultSemiBold">Challans</ThemedText>
						</TouchableOpacity>
					</View>
				</View>

				{/*/////////////////////////////////////////////////////////////////////////////////////////////// */}

				<ThemedView className=" rounded-t-[30px] p-4" style={{ elevation: 10 }}>
					{info ? (
						<ScrollView
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ paddingBottom: 400 }}
							className="p-2"
						>
							<ThemedText type="subtitle" className="mb-5 pl-1">
								{filteredVehicl && filteredVehicl[0]?.model}
							</ThemedText>

							<View className="pl-1 gap-2 mb-4">
								<View className="flex-row">
									<ThemedText type="small" className=" opacity-60">
										Plate Number :{" "}
									</ThemedText>
									<ThemedText type="small" className="font-semibold opacity-60">
										{filteredVehicl && filteredVehicl[0]?.plateNumber}
									</ThemedText>
								</View>

								{/* <View className="flex-row">
									<ThemedText type="small" className=" opacity-60">
										Model :{" "}
									</ThemedText>
									<ThemedText type="small" className="font-semibold opacity-60">
										{filteredVehicl && filteredVehicl[0]?.model}
									</ThemedText>
								</View> */}

								<View className="flex-row">
									<ThemedText type="small" className=" opacity-60">
										Color :{" "}
									</ThemedText>
									<ThemedText type="small" className="font-semibold opacity-60">
										{filteredVehicl && filteredVehicl[0]?.color}
									</ThemedText>
								</View>

								<View className="flex-row">
									<ThemedText type="small" className=" opacity-60">
										Make :{" "}
									</ThemedText>
									<ThemedText type="small" className="font-semibold opacity-60">
										{filteredVehicl && filteredVehicl[0]?.make}
									</ThemedText>
								</View>
							</View>

							<ThemedText type="defaultSemiBold" className="my-3">
								Important Docs
							</ThemedText>

							<View className="gap-2 mb-4">
								<TouchableOpacity className="flex-row rounded-xl bg-gray-200 p-5 justify-between items-center">
									<ThemedText type="defaultSemiBold">Liscence</ThemedText>
									<ExternalLink
										href="https://drive.google.com/file/d/1iEWzGHxGaxl0Mo5cl1oduTcIQruUo490/view?usp=drive_link"
										className="flex-1"
									/>
									<MaterialIcons name="keyboard-arrow-right" size={24} />
								</TouchableOpacity>

								<TouchableOpacity className="flex-row rounded-xl bg-gray-200 p-5 justify-between items-center">
									<ThemedText type="defaultSemiBold">RC</ThemedText>
									<ExternalLink
										href="https://drive.google.com/file/d/1OPtUDip8Xb4ZM_4qV4xrPmGx-a25Ja8M/view?usp=sharing"
										className="flex-1"
									/>
									<MaterialIcons name="keyboard-arrow-right" size={24} />
								</TouchableOpacity>

								<TouchableOpacity className="flex-row rounded-xl bg-gray-200 p-5 justify-between items-center">
									<ThemedText type="defaultSemiBold">Insurance</ThemedText>
									<ExternalLink
										href="https://drive.google.com/file/d/1w_V1Xf-fLtK1EDmUXX0gH5cx45LUf0vj/view?usp=drive_link"
										className="flex-1"
									/>
									<MaterialIcons name="keyboard-arrow-right" size={24} />
								</TouchableOpacity>

								<TouchableOpacity className="flex-row rounded-xl bg-gray-200 p-5 justify-between items-center">
									<ThemedText type="defaultSemiBold">Pollution</ThemedText>
									<ExternalLink
										href="https://drive.google.com/file/d/15BC5W8yHBj97zZf4geKnt0wILz3Cm-Ws/view?usp=drive_link"
										className="flex-1"
									/>
									<MaterialIcons name="keyboard-arrow-right" size={24} />
								</TouchableOpacity>
							</View>
						</ScrollView>
					) : (
						<ScrollView
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ paddingBottom: 400 }}
						>
							<View className="overflow-hidden justify-center rounded-[16px] p-2 ">
								<ThemedText type="defaultSemiBold" className="mb-4">
									Challan History
								</ThemedText>

								{filteredChallans.length > 0 ? (
									filteredChallans.map((challan, index) => (
										<ChallanCard
											index={index}
											challan={challan}
											key={index}
											isExpanded={activeCardId === challan.id}
											onPress={() => toggleCard(challan.id)}
										/>
									))
								) : challans === null ? (
									<Text className="p-3 pt-0">Fetching challans...</Text>
								) : (
									<View className="flex-1 mt-40 justify-center items-center">
										<ThemedText type="small">No challans issued...</ThemedText>
									</View>
								)}
							</View>
						</ScrollView>
					)}
				</ThemedView>
			</View>

			<StatusBar style="dark" />
		</>
	);
}
