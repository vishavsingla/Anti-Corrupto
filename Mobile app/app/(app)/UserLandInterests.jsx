import { View, Text, TextInput } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import LandCard from "../../components/LandCard";
import { ThemedText } from "@/components/ThemedText";
import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import { AndroidButton } from "../../components/AndroidButton";
import { FlashList } from "@shopify/flash-list";
import LandBuyersSheet from "../../components/LandBuyersSheet";
import { getUserLands } from "../../util/LandApi";
import { useAuth } from "../../util/AuthContext";
import {
	getInquiryLandsById,
	getUserInterestedLands,
} from "../../util/landInquiry";
import { fetchUserEmail } from "../../util/authApi";
import { router } from "expo-router";

export default function UserLandInterests() {
	const { userData } = useAuth();
	const [interestedLands, setInterestedLands] = useState([]);

	useEffect(() => {
		const fetchInterestedLands = async () => {
			const lands = await getUserInterestedLands(userData.id);
			setInterestedLands(lands);
			console.log("Interested Lands : ", lands);
		};
		fetchInterestedLands();
	}, []);

	return (
		<View className="flex-1 bg-[#f5faffff]">
			<View className="flex-row gap-3 m-4">
				<View className="flex-row flex-1 items-center gap-2 border border-gray-400 bg-gray-100 px-4 py-2 rounded-full my-2">
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

			<FlashList
				data={interestedLands}
				showsVerticalScrollIndicator={false}
				renderItem={({ item }) => (
					<LandCard
						landIdentificationNumber={item.land.landIdentificationNumber}
						landType={item.land.landType}
						area={item.land.area}
						dimensionOfLand={item.land.dimensionOfLand}
						location={item.land.location}
						status={item.status}
						interestsView={true}
            id={item.land.id}
            currentPrice={item.land.currentPrice}
            boughtPrice={item.land.boughtPrice}
            ownerId={item.land.ownerId}
            web3Id={item.land.web3Id}
					/>
				)}
				estimatedItemSize={10}
				keyExtractor={(item, index) => index}
				ListFooterComponent={<View className="h-20" />}
			/>
		</View>
	);
}
