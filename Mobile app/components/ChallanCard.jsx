import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import {
	Ionicons,
	MaterialIcons,
	AntDesign,
	Feather,
	FontAwesome5,
	FontAwesome,
} from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import PayChallanContract from "../Metamask/PayChallanContract";
import { ThemedText } from "../components/ThemedText";
import { AndroidButton } from "./AndroidButton";

export default function ChallanCard({ challan, isExpanded, onPress, index }) {

	return (
		<TouchableOpacity
			className="flex-row justify-between p-4 pr-3q mb-4 rounded-2xl bg-gray-200"
			onPress={onPress}
			activeOpacity={0.5}
		>
			{isExpanded ? (
				<View className="flex-1">
					<View className="flex-row justify-between items-center w-full">
						<View>
							<ThemedText type="defaultSemiBold">
								{index + 1}. {challan.reason}
							</ThemedText>

							<View className="flex-row items-center gap-0.5">
								<ThemedText type="small" className="font-medium py-1 ml-6">
									Fine:
								</ThemedText>
								<ThemedText type="link"> ₹{challan.fine}</ThemedText>
							</View>
						</View>

						{challan.status === true ? (
							<View className="justify-center items-center px-3 flex-row">
								<Text className=" font-medium pr-2">Paid</Text>
								<AntDesign name="checkcircle" size={20} color="green" />
							</View>
						) : (
							<PayChallanContract challan={challan} />
						)}
					</View>

					<View className="flex-row items-center gap-0.5">
						<ThemedText type="small" className="font-medium py-1 ml-6">
							Location:{" "}
						</ThemedText>
						<ThemedText type="link">{challan.location}</ThemedText>
					</View>

					<View className="flex-row items-center gap-0.5">
						<ThemedText type="small" className="font-medium py-1 ml-6">
							Issue Date:{" "}
						</ThemedText>
						<ThemedText type="link">{challan.issueDate}</ThemedText>
					</View>

					{challan.status === true ? (
						<AndroidButton
							onPress={() => {}}
							className="flex-1 rounded-full m-4 bg-[#b2bac6] border-gray-300"
						>
							<View className="flex-row justify-center items-center gap-2">
								<Ionicons name="receipt-sharp" size={18} color="black" />
								<ThemedText type="small" className="font-medium">
									View Receipt
								</ThemedText>
							</View>
						</AndroidButton>
					) : null}
				</View>
			) : (
				<View className="flex-row justify-between items-center w-full">
					<View>
						<ThemedText type="defaultSemiBold">
							{index + 1}. {challan.reason}
						</ThemedText>

						<View className="flex-row items-center gap-0.5">
							<ThemedText type="small" className="font-medium py-1 ml-6">
								Fine:
							</ThemedText>
							<ThemedText type="link"> ₹{challan.fine}</ThemedText>
						</View>
					</View>

					{challan.status === true ? (
						<View className="justify-center items-center px-3 flex-row">
							<Text className=" font-medium pr-2">Paid</Text>
							<AntDesign name="checkcircle" size={20} color="green" />
						</View>
					) : (
						<PayChallanContract challan={challan} />
					)}
				</View>
			)}
		</TouchableOpacity>
	);
}
