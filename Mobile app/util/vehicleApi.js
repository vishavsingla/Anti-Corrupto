import axios from "axios";
import { backendURL } from "./config";
import { getSessionToken } from "./tokenStore";

const API_URL = `${backendURL}`;

const getHeader = async () => {
	const sessionToken = await getSessionToken();
	return {
		headers: {
			Authorization: sessionToken, // Session token in header
		},
	};
};

export const getUserVehicles = async (userId) => {
	console.log("userId getUserVehicles: ", userId);
	try {
		const header = await getHeader();
		console.log("vehicles header: ", header);
		const response = await axios.get(
			`${API_URL}/vehicle/view/all/${userId}`,
			header
		);
		return response.data;
	} catch (error) {
		console.error(
			"Error fetching vehicles:",
			error.response?.data || error.message
		);
		throw error;
	}
};

export const getOneVehicles = async (vehicleId) => {
	try {
		const header = await getHeader();
		const response = await axios.get(
			`${API_URL}/vehicle/view/${vehicleId}`,
			header
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const addVehicle = async (vehicle) => {
	try {
		const header = await getHeader();
		const response = await axios.post(`${API_URL}/vehicle/add`, vehicle, header);
		return response;
	} catch (error) {
		throw error;
	}
};

export const updateVehicle = async (userId, vehicleId, vehicle) => {
	try {
		const header = await getHeader();
		const response = await axios.post(
			`${API_URL}/${userId}/vehicles/${vehicleId}`,
			vehicle,
			header
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const deleteVehicle = async (userId, vehicleId) => {
	try {
		const header = await getHeader();
		const response = await axios.post(
			`${API_URL}/${userId}/vehicles/${vehicleId}`,
			null,
			header
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};
