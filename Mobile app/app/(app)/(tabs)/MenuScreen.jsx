import {
	Image,
	ScrollView,
	Text,
	TextInput,
	SafeAreaView,
	View,
	Button,
	TouchableOpacity,
	ImageBackground,
	Modal,
	Pressable,
	TouchableHighlight,
} from "react-native";
import {
	Ionicons,
	MaterialIcons,
	AntDesign,
	MaterialCommunityIcons,
	Feather,
	FontAwesome5,
} from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import Colors from "../../../components/Colors";
import { AndroidButton } from "../../../components/AndroidButton";
import { router } from "expo-router";
import { useAuth } from "../../../util/AuthContext";
import { ThemedText } from "../../../components/ThemedText";

export default function MenuScreen() {
	const { logOut, userData } = useAuth(); // Access auth state from context

	return (
		<ImageBackground
			source={require("../../../assets/images/light.png")}
			resizeMode="cover"
			style={{ flex: 1 }}
			opacity={0.85}
		>
			<View className="flex-1">
				<View className="p-3">
					<View className="p-2 pt-10 flex-row justify-between items-center ">
						<View className="flex-row justify-between items-center">
							{/* <Image
								source={require("../../assets/images/Emblem_of_India.png")}
								className="w-[12%] h-[100%]"
								tintColor={"#0062f5"}
							/> */}
							<Ionicons
								name="person-circle"
								size={26}
								color={Colors.primaryBlue}
								style={{ marginRight: 6 }}
							/>

							<Text className="text-primaryBlue text-lg text-center font-bold">
								Anti Corruptō
							</Text>
						</View>

						<View className="flex-row justify-between items-center">
							<Feather
								name="bell"
								size={24}
								color={Colors.primaryBlue}
								style={{ padding: 2, paddingHorizontal: 8 }}
							/>
							<AntDesign
								name="search1"
								size={24}
								color={Colors.primaryBlue}
								style={{ padding: 2, paddingHorizontal: 8, paddingRight: 2 }}
							/>
						</View>
					</View>

					{/* <AndroidButton className="rounded-3xl"> */}
					<View className="flex-row px-6 py-9 justify-start items-center">
						<Image
							source={require("../../../assets/images/joker.png")}
							style={{
								width: 100,
								height: 100,
								borderRadius: 60,
								borderWidth: 2,
								borderColor: "#696969ff",
							}}
						/>
						<View>
							<Text className=" text-2xl font-bold ml-4">{userData?.name}</Text>
							<ThemedText type="link" className=" text-s ml-4">
								{userData?.email}
							</ThemedText>
						</View>
					</View>
					{/* </AndroidButton> */}
				</View>

				{/* ///////////////////////////////////////////////////////////////////////////////////////////////////////// */}

				<View
					className="flex-1 rounded-t-[32px] bg-white pt-3 overflow-hidden"
					style={{
						elevation: 30,
					}}
				>
					<ScrollView
						className="rounded-3xl overflow-hidden mx-2 pt-2"
						showsVerticalScrollIndicator={false}
						// fadingEdgeLength={200}
					>
						<AndroidButton className="rounded-2xl mb-[-8]">
							<View className="flex-row justify-between items-center my-[-2]">
								<View className="flex-row">
									<View className="bg-primaryBlue rounded-2xl p-4">
										<Ionicons name="person-circle-outline" size={22} color="white" />
									</View>
									<Text className="text-base font-medium mx-2 p-4 ">My Profile</Text>
								</View>
								<MaterialIcons name="keyboard-arrow-right" size={24} />
							</View>
						</AndroidButton>

						<AndroidButton className="rounded-2xl mb-[-8]">
							<View className="flex-row justify-between items-center my-[-2]">
								<View className="flex-row">
									<View className="bg-primaryBlue rounded-2xl p-4">
										<Feather name="activity" size={22} color="white" />
									</View>
									<Text className="text-base font-medium mx-2 p-4 ">
										Activity History
									</Text>
								</View>
								<MaterialIcons name="keyboard-arrow-right" size={24} />
							</View>
						</AndroidButton>

						<AndroidButton
							className="rounded-2xl mb-[-8]"
							onPress={() => {
								router.navigate("Traffic");
							}}
						>
							<View className="flex-row justify-between items-center my-[-2]">
								<View className="flex-row">
									<View className="bg-primaryBlue rounded-2xl p-4">
										<FontAwesome5 name="car" size={22} color="white" />
									</View>
									<Text className="text-base font-medium mx-2 p-4 ">My Vehicles</Text>
								</View>
								<MaterialIcons name="keyboard-arrow-right" size={24} />
							</View>
						</AndroidButton>

						<AndroidButton
							className="rounded-2xl mb-[-8]"
							onPress={() => {
								router.navigate("Lands");
							}}
						>
							<View className="flex-row justify-between items-center my-[-2]">
								<View className="flex-row">
									<View className="bg-primaryBlue rounded-2xl p-4">
										<MaterialIcons name="landscape" size={22} color="white" />
									</View>
									<Text className="text-base font-medium mx-2 p-4 ">My Lands</Text>
								</View>
								<MaterialIcons name="keyboard-arrow-right" size={24} />
							</View>
						</AndroidButton>

						<AndroidButton className="rounded-2xl mb-[-8]">
							<View className="flex-row justify-between items-center my-[-2]">
								<View className="flex-row">
									<View className="bg-primaryBlue rounded-2xl p-4">
										<Ionicons name="language" size={22} color="white" />
									</View>
									<Text className="text-base font-medium mx-2 p-4 ">Language</Text>
								</View>
								<MaterialIcons name="keyboard-arrow-right" size={24} />
							</View>
						</AndroidButton>

						<AndroidButton className="rounded-2xl mb-[-8]">
							<View className="flex-row justify-between items-center my-[-2]">
								<View className="flex-row">
									<View className="bg-primaryBlue rounded-2xl p-4">
										<Feather name="bell" size={22} color="white" />
									</View>
									<Text className="text-base font-medium mx-2 p-4 ">Notifications</Text>
								</View>
								<MaterialIcons name="keyboard-arrow-right" size={24} />
							</View>
						</AndroidButton>

						<AndroidButton className="rounded-2xl mb-[-8]">
							<View className="flex-row justify-between items-center my-[-2]">
								<View className="flex-row">
									<View className="bg-primaryBlue rounded-2xl p-4">
										<Feather name="unlock" size={22} color="white" />
									</View>
									<Text className="text-base font-medium mx-2 p-4 ">
										Change Password
									</Text>
								</View>
								<MaterialIcons name="keyboard-arrow-right" size={24} />
							</View>
						</AndroidButton>

						<AndroidButton className="rounded-2xl mb-[-8]">
							<View className="flex-row justify-between items-center my-[-2]">
								<View className="flex-row">
									<View className="bg-primaryBlue rounded-2xl p-4">
										<Feather name="help-circle" size={22} color="white" />
									</View>
									<Text className="text-base font-medium mx-2 p-4 ">Help</Text>
								</View>
								<MaterialIcons name="keyboard-arrow-right" size={24} />
							</View>
						</AndroidButton>

						<AndroidButton
							className="rounded-2xl mb-[-8]"
							onPress={() => {
								router.navigate("Report");
							}}
						>
							<View className="flex-row justify-between items-center my-[-2]">
								<View className="flex-row">
									<View className="bg-primaryBlue rounded-2xl p-4">
										<MaterialIcons name="error-outline" size={22} color="white" />
									</View>
									<Text className="text-base font-medium mx-2 p-4 ">Report</Text>
								</View>
								<MaterialIcons name="keyboard-arrow-right" size={24} />
							</View>
						</AndroidButton>

						<AndroidButton
							className="rounded-2xl border border-[#ef4444] m-4 mt-5"
							rippleColor="#ff9c9c"
							onPress={() => {
								logOut();
							}}
						>
							<View className="flex-row justify-center m-[-2]">
								<Feather name="log-out" size={20} color={"rgb(239, 68, 68)"} />
								<Text className="text-base text-center font-medium text-red-500">
									Log Out
								</Text>
							</View>
						</AndroidButton>

						<View className="p-8"></View>
					</ScrollView>
				</View>
			</View>
		</ImageBackground>
	);
}
