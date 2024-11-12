import axios from "axios";
import { backendURL } from "./config";
import { getSessionToken } from "./tokenStore";

const API_URL = `${backendURL}/land`;

const getHeader = async () => {
	const sessionToken = await getSessionToken();
	return {
		headers: {
			Authorization: sessionToken, // Session token in headers
		},
	};
};

export const getAllLands = async () => {
	console.log("In getlands api");
	try {
		const header = await getHeader();
		const response = await axios.get(`${API_URL}/all`, header);
		// console.log('In api   :    ', response);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getUserLands = async (userData) => {
	try {
		const header = await getHeader();
		console.log("In getUserLands api : ", userData.id);
		const response = await axios.get(`${API_URL}/${userData.id}`, header);
		// console.log('In api   :    ', response);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getOneLand = async (landId) => {
	if (true) {
		const header = await getHeader();
		// console.log('api get one landddd : ', landId.id);
		const response = await axios.get(`${API_URL}/land/${landId.id}`, header);
		// console.log('trans in land api : ', response);
		return response;
	}
	// catch (error) {
	//   throw error;
	// }
};

export const addLand = async (land) => {
	try {
		const header = await getHeader();
		const response = await axios.post(`${API_URL}/create`, land, header);
		// console.log(response);
		return response;
	} catch (error) {
		throw error;
	}
};

export const updateLand = async (userId, LandId, land) => {
	try {
		const header = await getHeader();
		const response = await axios.post(
			`${API_URL}/${userId}/${LandId}`,
			land,
			header
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const addLandIdToDB = async (landid, LandBlockchainId) => {
	console.log("hi");
	console.log(landid, LandBlockchainId);
	LandBlockchainId = Number(LandBlockchainId).toString();
	try {
		const header = await getHeader();
		const response = await axios.post(
			`${API_URL}/add/land/id/indb/${landid}`,
			{ LandBlockchainId },
			header
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};
