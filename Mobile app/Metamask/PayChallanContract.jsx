import { Text, View, StyleSheet, Pressable, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import PrimaryButton from "../components/primaryButton";
import { useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import ChallanABI from "./ABI's/ChallanABI.json";
import Web3 from "./WalletConnect";
import { addVehicle } from "../util/vehicleApi";
import { getSessionToken } from "../util/tokenStore";
import { fetchUserDetails } from "../util/authApi";
import { useNavigation } from "@react-navigation/native";
import { getChallansById, updateChallanStatus } from "../util/challanApi";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function PayChallanContract({ challan }) {
	const getChallanDetails = async () => {
		console.log("Challan : ", challan);
		const challanData = await getChallansById(challan.id);
		console.log("Returned Challan Data: ", challanData);
		return challanData;
	};

	const { data, isPending, isSuccess, sendTransaction } = useSendTransaction();

	useEffect(() => {
		const updatePayment = async () => {
			if (isPending) {
				console.log("Loading...");
			}
			if (isSuccess) {
				console.log("Challan Paid successfully", JSON.stringify(data));
				try {
					const challanData = await getChallanDetails();
					const updateinDB = await updateChallanStatus(challanData.id);
					console.log("Challan Updated in DB: ", updateinDB);
					if (updateinDB.status == true) {
						console.log("Challan Payment done, also updated in DB successfully");
					} else {
						console.log(
							"Error updating challan in DB, status code:",
							updateinDB.status
						);
					}
				} catch (error) {
					console.log("Error updating challan in DB", error);
				}
			}
		};

		updatePayment();
	}, [isPending, isSuccess]);

	return (
		<Pressable
			android_ripple={{ color: "#9ac3ffff" }}
			className="p-4 px-6 items-center rounded-lg justify-center overflow-hidden bg-primaryBlue"
			onPress={() => {
				try {
					sendTransaction({
						to: "0x8e6065baccC5B3a9F68DD974F0d06E1D804797B6",
						value: parseEther(challan.fine.toString()),
					});
				} catch (error) {
					console.log(error);
				}
			}}
		>
			<Text className="text-white">Pay</Text>
		</Pressable>
	);
}
