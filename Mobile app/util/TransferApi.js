import axios from "axios";
import { backendURL } from "./config";
import { getSessionToken } from "./tokenStore";

const BASE_URL = `${backendURL}`;

const getHeader = async () => {
	const sessionToken = await getSessionToken();
	return {
		headers: {
			Authorization: sessionToken,
		},
	};
};

const createTransferLand = async (transferLandData) => {
	try {
		const header = await getHeader();
		const response = await axios.post(
			`${BASE_URL}/transferland/create`,
			transferLandData,
			header
		);
		return response;
	} catch (error) {
		throw new Error(error.response.data.error || "Something went wrong");
	}
};

const getAllTransferLands = async () => {
	try {
		const header = await getHeader();
		const response = await axios.get(`${BASE_URL}/transferland/all`, header);
		return response.data;
	} catch (error) {
		throw new Error(error.response.data.error || "Something went wrong");
	}
};

const getTransferLandById = async (id) => {
	try {
		const header = await getHeader();
		const response = await axios.get(`${BASE_URL}/transferland/${id}`, header);
		return response.data;
	} catch (error) {
		throw new Error(error.response.data.error || "Something went wrong");
	}
};

const getTransferLandsByUser = async (userId) => {
	try {
		const header = await getHeader();
		const response = await axios.get(
			`${BASE_URL}/transferland/user/${userId}`,
			null,
			header
		);
		return response.data;
	} catch (error) {
		throw new Error(error.response.data.error || "Something went wrong");
	}
};

export {
	createTransferLand,
	getAllTransferLands,
	getTransferLandById,
	getTransferLandsByUser,
};
