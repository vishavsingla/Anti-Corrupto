import React, { useState, useEffect } from 'react';
import { challancontractABI, challancontractAddress } from '../Utils/ethers/constants';
import { ethers } from 'ethers';
import { useParams } from 'react-router-dom';

export const ChallanContext = React.createContext();

const { ethereum } = window;

const ChallanProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    challanId: useParams(),
    vehicleId: '',
    issueDate: '',
    paid: '',
    amount: '',
    location: '',
    reason: '',
  });

  const [currentAccount, setCurrentAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [challanCount, setChallanCount] = useState(localStorage.getItem('challanCount'));
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);

  const checkIfWalletIsConnect = async () => {
    try {
      // if (!ethereum) return alert('Please install MetaMask.');

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getUserChallansfunc(accounts[0]);
        return 200;
      } else {
        console.log('No accounts found');
      }
      return 400;
    } catch (error) {
      console.log(error);
      return 400;
    }
  };

  const getChallanContract = async () => {
    // const checkWallet = checkIfWalletIsConnect();
    // if(checkWallet != 200) return alert('Please connect/install your wallet first');

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const challanContract = new ethers.Contract(challancontractAddress, challancontractABI, signer);

    return challanContract;
  };

  const addChallanToBlockchain = async (formData) => {
    // const checkWallet = checkIfWalletIsConnect();
    // if(checkWallet != 200) return alert('Please connect/install your wallet first');
    try {
      const challanContract = await getChallanContract();
      const { vehicleId, issueDate, paid, amount, location, reason } = formData;

      console.log(challanContract);

      const challanTransaction = await challanContract.issueChallan(
        vehicleId,
        amount,
        reason,
        location
      );

      setIsLoading(true);
      console.log(`Loading - ${challanTransaction.hash}`);
      await challanTransaction.wait();
      console.log(`Success - ${challanTransaction.hash}`);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const getUserChallansfunc = async (account) => {
    // const checkWallet = checkIfWalletIsConnect();
    // if(checkWallet != 200) return alert('Please connect/install your wallet first');
    try {
      const challanContract = await getChallanContract();

      const challans = await challanContract.getUserChallans(account);
      console.log('your challans', challans);
      const structuredTransactions = challans.map((challan) => ({
        challanId: challan.challanId,
        vehicleId: challan.vehicleId,
        issueDate: challan.issueDate,
        paid: challan.paid,
        amount: challan.amount,
        reason: challan.reason,
        location: challan.location,
      }));
      console.log(structuredTransactions);
      console.log('In get All Transaction');
      setTransactions(structuredTransactions);
    } catch (err) {
      console.log(err);
    }
  };

  const payChallan = async (formData) => {
    // const checkWallet = checkIfWalletIsConnect();
    // if(checkWallet != 200) return alert('Please connect/install your wallet first');
    // try {
      const challanContract = await getChallanContract();

      const { vehicleId, issueDate, paid, fine, location, reason } = formData;
      // const { challanId } = useParams();
      console.log(formData);
      console.log(fine);
      let amt = fine + '';
      console.log(amt);
      const parsedAmount = ethers.parseEther(amt);

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: currentAccount,
            to: '0x160488466388Ca3A2CC8Dcf2CeBb5EE5230C8009',
            gas: '0x5208',
            value: parsedAmount.toString(16),
          },
        ],
      });
      console.log('parsedAmount : ', parsedAmount);
      console.log('currentAccount : ', challanId);
      const challanTransaction = await challanContract.payChallan(challanId);
      console.log('hiiiii');
      setIsLoading(true);
      console.log(`Loading - ${challanTransaction.hash}`);
      await challanTransaction.wait();
      console.log(`Success - ${challanTransaction.hash}`);
      setIsLoading(false);
    // } catch (err) {
    //   console.log(err);
    // }
  };

  return (
    <ChallanContext.Provider
      value={{
        formData,
        handleChange,
        payChallan,
        addChallanToBlockchain,
        checkIfWalletIsConnect,
        getUserChallansfunc,
        challanCount,
      }}
    >
      {children}
    </ChallanContext.Provider>
  );
};

export default ChallanProvider;
