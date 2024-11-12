import { View, Text, TextInput, useColorScheme } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import LandCard from "../../components/LandCard";
import { ThemedText } from "@/components/ThemedText";
import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import { AndroidButton } from "../../components/AndroidButton";
import { FlashList } from "@shopify/flash-list";
import LandBuyersSheet from "../../components/LandBuyersSheet";
import { getUserLands } from "../../util/LandApi";
import { useAuth } from "../../util/AuthContext";
import { getInquiryLandsById } from "../../util/landInquiry";
import { fetchUserEmail } from "../../util/authApi";
import { MotiView, MotiText } from "moti";
import { Skeleton } from "moti/skeleton";

export default function Lands() {
	const [showSheet, setShowSheet] = useState(false);
	const [myLands, setMyLands] = useState(null);
	const [propLandId, setPropLandId] = useState("");
	// ref
	const bottomSheetRef = useRef(null);
	const handleClosePress = () => bottomSheetRef.current?.close();
	const handleOpenPress = () => {
		setShowSheet(true);
		bottomSheetRef.current?.snapToIndex(0);
	};

	const colorScheme = useColorScheme();
	const colorMode = colorScheme == "dark" ? "dark" : "light";

	const { userData } = useAuth();

	console.log("My Lands : ", myLands);

	useEffect(() => {
		const getMyLands = async () => {
			const lands = await getUserLands(userData);
			setMyLands(lands);
		};
		getMyLands();
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

			{myLands === null ? (
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
			) : myLands.length === 0 ? (
				<View className="flex-1 justify-center items-center">
					<ThemedText className="text-center text-lg">No Lands found...</ThemedText>
				</View>
			) : (
				<FlashList
					data={myLands}
					showsVerticalScrollIndicator={false}
					renderItem={({ item }) => (
						<LandCard
							{...item}
							onpres={() => {
								console.log("Land Card Press");
								setPropLandId(item.id);
								handleOpenPress();
							}}
						/>
					)}
					estimatedItemSize={10}
					keyExtractor={(item, index) => index}
					ListFooterComponent={<View className="h-20" />}
				/>
			)}

			{showSheet && (
				<LandBuyersSheet
					closeSheet={() => handleClosePress()}
					ref={bottomSheetRef}
					landId={propLandId}
				/>
			)}
		</View>
	);
}
