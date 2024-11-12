import React, { useEffect, useRef, useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Alert,
} from "react-native";
import PrimaryButton from "../../components/primaryButton";
import Colors from "../../components/Colors";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import * as Yup from "yup";
import * as Location from "expo-location";
import CityList from "../../util/CityList.json";
import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
// import { addVehicle } from "../util/vehicleApi";
// import { getSessionToken } from "../util/tokenStore";
// import AddVehicle from "../Metamask/AddvehicleContract";
import Web3 from "../../Metamask/WalletConnect";
import AddChallanContract from "../../Metamask/AddChallanContract";
import { addChallan } from "../../util/challanApi";

export default function AddChallan({ navigation }) {
	const [coordinates, setCoordinates] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [selectedCity, setSelectedCity] = useState(null);
	const [selectedState, setSelectedState] = useState(null);
	const [cities, setCities] = useState([]);

	const pickerRef = useRef();

	function open() {
		pickerRef.current.focus();
	}

	function close() {
		pickerRef.current.blur();
	}

	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				setErrorMsg("Permission to access location was denied");
				return;
			}
			try {
				let location = await Location.getCurrentPositionAsync({});
				setCoordinates(location);
			} catch (error) {
				console.error("Error getting current position:", error);
				setErrorMsg("Error getting current position");
			}
		})();
	}, []);

	return (
			<View className="flex-1">
				<Formik
					initialValues={{
						vehicleId: "",
						amount: "",
						location: "",
						reason: "",
					}}
					onSubmit={(values) => {
						// console.log(values);
					}}
				>
					{({
						handleChange,
						handleSubmit,
						setFieldValue,
						values,
						touched,
						errors,
					}) => (
						<View className=" flex-1 flex-col justify-between items-center w-full h-full bg-white p-3">
							<View className=" py-24 ">
								<Text className="text-2xl font-bold text-center text-primaryBlue">
									Add Chalaan
								</Text>
							</View>

							<View className=" flex-col w-full pb-52 px-4 justify-between ">
								<TextInput
									className=" mb-4 border-b border-gray-200 py-2 px-2 text-base text-gray-700"
									placeholder="Vehicle ID"
									onChangeText={handleChange("vehicleId")}
									value={values.vehicleId}
								/>
								<TextInput
									className=" border-b mb-4 border-gray-200 py-2 px-2 text-base text-gray-700"
									placeholder="Amount"
									onChangeText={handleChange("amount")}
									value={values.amount}
								/>
								<TextInput
									className=" border-b mb-2 border-gray-200 py-2 px-2 text-base text-gray-700"
									placeholder="Reason"
									onChangeText={handleChange("reason")}
									value={values.reason}
								/>

								<View className="border-b mb-4 space-x-4 border-gray-200 items-center flex-row justify-between">
									<Picker
										selectedValue={selectedState}
										onValueChange={(state) => {
											setSelectedState(state);
											setCities(CityList[state]);
											setFieldValue(
												"location",
												`State: ${state}, City: ${selectedCity}, Latitude: ${coordinates.coords.latitude}, Longitude: ${coordinates.coords.longitude}`
											);
										}}
										style={{ flex: 1 }}
									>
										{selectedState === null ? (
											<Picker.Item label="State" value={null} style={{ color: "grey" }} />
										) : null}

										{Object.keys(CityList).map((state, index) => (
											<Picker.Item key={index} label={state} value={state} />
										))}
									</Picker>

									<Picker
										selectedValue={selectedCity}
										onValueChange={(city) => {
											setSelectedCity(city);
											setFieldValue(
												"location",
												`State: ${selectedState}, City: ${city}, Latitude: ${coordinates.coords.latitude}, Longitude: ${coordinates.coords.longitude}`
											);
										}}
										style={{ flex: 1 }}
									>
										{selectedCity === null ? (
											<Picker.Item label="City" value={null} style={{ color: "grey" }} />
										) : null}

										{cities.map((city, index) => (
											<Picker.Item key={index} label={city} value={city} />
										))}
									</Picker>
								</View>

								<View className=" my-8">
									<AddChallanContract values={values} />

									{/* <PrimaryButton
										onPress={async () => {
											try {
												const addtoDB = await addChallan(values);
												if (addtoDB.status == 200) {
													console.log("Challan added to DB successfully");
													navigation.navigate("Traffic");
												} else {
													console.log(
														"Error adding challan to DB, status code:",
														addtoDB.status
													);
												}
											} catch (error) {
												console.log("Error adding challan to DB", error);
											}
										}}
									>
										DB only
									</PrimaryButton> */}
								</View>
							</View>
						</View>
					)}
				</Formik>
			</View>
	);
}
