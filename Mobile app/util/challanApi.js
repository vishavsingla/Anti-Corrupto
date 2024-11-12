import axios from "axios";
import { backendURL } from "./config";
import { getSessionToken } from "./tokenStore";

const API_URL = `${backendURL}/challan`;

const getHeader = async () => {
	const sessionToken = await getSessionToken();
	return {
		headers: {
			Authorization: sessionToken, // Session token in headers
		},
	};
};

export const addChallan = async (challan) => {
	try {
		const header = await getHeader();
		const response = await axios.post(`${API_URL}/add`, challan, header);
		return response;
	} catch (error) {
		throw error;
	}
};

export const getVehicleChallans = async () => {
	try {
		const header = await getHeader();
		console.log("challan header: ", header);
		const response = await axios.get(`${API_URL}/view`, header);
		return response.data;
	} catch (error) {
		console.error(
			"Error fetching challans:",
			error.response?.data || error.message
		);
		throw error;
	}
};

export const getChallansById = async (challanId) => {
	try {
		const header = await getHeader();
		const response = await axios.get(`${API_URL}/view/${challanId}`, header);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const updateChallanStatus = async (challanId) => {
	try {
		const header = await getHeader();
		const response = await axios.post(
			`${API_URL}/change/challan/status/${challanId}`,
			header
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};
