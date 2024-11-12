import axios from "axios";
import { backendURL } from "./config";
import { getSessionToken } from "./tokenStore";

const API_URL = `${backendURL}/inquiry`;

const getHeader = async () => {
	const sessionToken = await getSessionToken();
	return {
		headers: {
			Authorization: `Bearer ${sessionToken}`,
		},
	};
};

export const getAllInquiries = async () => {
	try {
		const header = await getHeader();
		const response = await axios.get(API_URL, header);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getInquiryById = async (inquiryId) => {
	try {
		const header = await getHeader();
		const response = await axios.get(`${API_URL}/${inquiryId}`, header);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getInquiryLandsById = async (landId) => {
	try {
		const header = await getHeader();
		const response = await axios.get(`${API_URL}/land/${landId}`, header);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const createInquiry = async (inquiry) => {
	try {
		console.log(inquiry);
		const header = await getHeader();
		const response = await axios.post(`${API_URL}`, inquiry, header);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getUserInterestedLands = async (clientId) => {
	try {
		console.log("In api : ", clientId);
		const header = await getHeader();
		const response = await axios.get(`${API_URL}/${clientId}`, header);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const updateInquiryStatus = async (inquiryId, status) => {
	try {
		console.log(inquiryId, status);
		const header = await getHeader();
		const response = await axios.post(
			`${API_URL}/change/status/${inquiryId}`,
			{ status },
			null,
			header
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const deleteInquiry = async (inquiryId) => {
	try {
		const header = await getHeader();
		await axios.delete(`${API_URL}/${inquiryId}`, null, header);
		return { message: "Inquiry deleted successfully" };
	} catch (error) {
		throw error;
	}
};
