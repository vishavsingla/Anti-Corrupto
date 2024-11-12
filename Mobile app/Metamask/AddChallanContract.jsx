import { Text, View, StyleSheet, Pressable, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import PrimaryButton from "../components/primaryButton";
import {
	useContractRead,
	useContractWrite,
	usePrepareContractWrite,
} from "wagmi";
import ChallanABI from "./ABI's/ChallanABI.json";
import Web3 from "./WalletConnect";
import { addVehicle } from "../util/vehicleApi";
import { getSessionToken } from "../util/tokenStore";
import { useNavigation } from "@react-navigation/native";
import { addChallan } from "../util/challanApi";

export default function AddChallanContract({ values }) {
	const navigation = useNavigation();

	const { vehicleId, reason, amount, location } = values;

	console.log(
		"VID:",
		vehicleId,
		", Reason:",
		reason,
		", Amount:",
		amount,
		", Location:",
		location
	);

	// Writing to the Contract
	const { config } = usePrepareContractWrite({
		address: "0xa2af8bada2d9f3236a74141a1bc34fe85e79a943",
		abi: ChallanABI,
		functionName: "issueChallan",
		args: [vehicleId, amount, reason, location],
	});

	const { data, isLoading, isSuccess, write } = useContractWrite(config);

	useEffect(() => {
		const addChallanToChainAndDB = async () => {
			if (isLoading) {
				console.log("Loading...");
			}
			if (isSuccess) {
				console.log("Challan added successfully to chain", JSON.stringify(data));
				try {
					const addtoDB = await addChallan(values);
					if (addtoDB.status == 200) {
						console.log("Challan added to DB successfully");
						navigation.navigate("Traffic");
					} else {
						console.log("Error adding challan to DB, status code:", addtoDB.status);
					}
				} catch (error) {
					console.log("Error adding challan to DB", error);
				}
			}
		};

		addChallanToChainAndDB();
	}, [isLoading, isSuccess]);

	return (
			<PrimaryButton
				onPress={() => {
					try {
						write?.();
					} catch (error) {
						console.log(error);
					}
				}}
			>
				Add Challan
			</PrimaryButton>
	);
}
