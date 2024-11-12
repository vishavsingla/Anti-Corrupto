import {
	Text,
	View,
	StyleSheet,
	Pressable,
	Alert,
	ToastAndroid,
} from "react-native";
import React, { useState, useEffect } from "react";
import { usePrepareTransactionRequest, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { updateChallan } from "../util/challanApi";
import { createTransferLand } from "../util/TransferApi";
import { AndroidButton } from "../components/AndroidButton";
import { FontAwesome6 } from "@expo/vector-icons";

export default function LandTransferContract({ formData }) {
	console.log("formData", formData);
	const { landId, transferAmount } = formData;

	const exchangeRate = "50735.67";
	// console.log("Amount to send in Ruppees", transferAmount);
	const amountToSend = (transferAmount * 0.000000000000000001).toFixed(18);
	// console.log("Amount to send in Contract", amountToSend);

	const { sendTransaction, isPending, isSuccess, data } = useSendTransaction();

	const updateinDB = async () => {
		console.log("Database updation initiated...");
		const response = await createTransferLand(formData);
		console.log("Land-Transfer response : ", response.data);
		if (response.status == 200) {
			ToastAndroid.showWithGravity(
				"Payment Successfull ✅, Land Transfer Completed.",
				ToastAndroid.LONG,
				ToastAndroid.BOTTOM
			);
		} else {
			console.log("Error updating in DB", response.error);
		}
	};

	useEffect(() => {
		try {
			if (isPending) {
				console.log("Loading...");
			}
			if (isSuccess) {
				console.log("Amount Paid successfully", JSON.stringify(data));
				updateinDB();
			}
		} catch (error) {
			console.log("Blockchain Transaction Failed :", error);
			ToastAndroid.showWithGravity(
				"Blockchain Transaction Failed! Please try again.",
				ToastAndroid.LONG,
				ToastAndroid.BOTTOM
			);
		}
	}, [isPending, isSuccess]);

	return (
		<AndroidButton
			onPress={() => {
				try {
					sendTransaction({
						to: "0x8e6065baccC5B3a9F68DD974F0d06E1D804797B6", //my 2nd address
						value: parseEther(amountToSend.toString()),
					});
				} catch (error) {
					console.log("button press error:", error);
				}
			}}
			innerStyle={{
				paddingHorizontal: 26,
				flexDirection: "row",
				gap: 6,
				alignItems: "center",
				justifyContent: "center",
			}}
			style={{
				borderRadius: 999,
				backgroundColor: "#2eaf95",
			}}
			rippleColor="#00deae"
		>
			<FontAwesome6 name="ethereum" size={16} color="white" />
			<Text className="color-white">Pay Now</Text>
		</AndroidButton>
	);
}
