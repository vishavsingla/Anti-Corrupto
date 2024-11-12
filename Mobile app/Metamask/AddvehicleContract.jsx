import { Text, View, StyleSheet, Pressable, Alert } from "react-native";
import React, { useEffect } from "react";
import PrimaryButton from "../components/primaryButton";
import {
	useContractRead,
	useContractWrite,
	usePrepareContractWrite,
} from "wagmi";
import addVehicleABI from "./ABI's/addVehicleABI.json";
import Web3 from "./WalletConnect";
import { addVehicle } from "../util/vehicleApi";
import { getSessionToken } from "../util/tokenStore";
import { fetchUserDetails } from "../util/authApi";
import { useNavigation } from "@react-navigation/native";

export default function AddvehicleContract({ values }) {
	const navigation = useNavigation();

	const {
		vehicleID,
		year,
		make,
		model,
		plateNum,
		color,
		insuranceValidity,
		pollutionValidity,
	} = values;

	console.log(
		"VID:",
		vehicleID,
		", Year:",
		year,
		", Make:",
		make,
		", Model:",
		model,
		", Plate:",
		plateNum,
		", Color:",
		color,
		", insurance:",
		insuranceValidity,
		", Pollution:",
		pollutionValidity
	);

	// Writing to the Contract
	const { config } = usePrepareContractWrite({
		address: "0xe1eeeff54b4ebe113c383315ecd49b494cf32c46",
		abi: addVehicleABI,
		functionName: "addVehicle",
		args: [
			vehicleID,
			parseInt(year),
			make,
			model,
			plateNum,
			color,
			insuranceValidity,
			pollutionValidity,
		],
	});

	const { data, isLoading, isSuccess, write } = useContractWrite(config);

	useEffect(() => {
		const addVehicleToChainAndDB = async () => {
			if (isLoading) {
				console.log("Loading...");
			}
			if (isSuccess) {
				console.log("Vehicle added successfully to chain", JSON.stringify(data));
				try {
					const token = await getSessionToken();
					const thisuser = await fetchUserDetails(token);
					const userId = thisuser.data.id;
					values.ownerId = userId;
					const addtoDB = await addVehicle(values);
					if (addtoDB.status == 200) {
						console.log("Vehicle added to DB successfully");
						navigation.navigate("Traffic");
					} else {
						console.log("Error adding vehicle to DB, status code:", addtoDB.status);
					}
				} catch (error) {
					console.log("Error adding vehicle to DB", error);
				}
			}
		};

		addVehicleToChainAndDB();
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
				Add Vehicle
			</PrimaryButton>
	);
}
