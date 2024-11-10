import axios from 'axios';
import { getCookie } from '../cookieSetup';
import { backendURL } from '../config';

const API_URL = `${backendURL}/challan`;

const sessionToken = getCookie('token');
const header = {
  headers: {
    Authorization: sessionToken,
  },
};

export const addChallan = async (challan) => {
  try {
    const response = await axios.post(`${API_URL}/add`, challan, header);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getVehicleChallans = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/view`, header);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getChallansById = async (challanId) => {
  try {
    const response = await axios.get(`${API_URL}/view/${challanId}`, header);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateChallanStatus = async (challanId) => {
  try {
    const response = await axios.post(`${API_URL}/change/challan/status/${challanId}`, header);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addChallanTransactionHashToDB = async (challanId, transactionHash) => {
  try {
    console.log("In API: ",challanId, transactionHash)
    const response = await axios.post(`${API_URL}/update/challan/transactionhash/${challanId}/${transactionHash}`, header);
    return response;
  } catch (error) {
    throw error;
  }
};
