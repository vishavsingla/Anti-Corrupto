import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LandContext } from '../../context/LandContext';
import HeaderAdmin from '../../components/HeaderAdmin';
import axios from 'axios';
import { ethers } from 'ethers';
import { createTransferLand } from '../../Utils/API/transferAPI';
import { getOneLand } from '../../Utils/API/landAPI';
import Navbar from '../../components/Navbar';

const TransferLand = () => {
  const [error, setError] = useState('');
  const [iserror, setIsError] = useState(false);
  const [newOwnerAddress, setNewOwnerAddress] = useState('');
  const [newOwnerId, setNewOwnerId] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [predictionn, setPrediction] = useState('');

  const landId = useParams();

  const navigate = useNavigate();

  const {
    currentAccount,
    LandCount,
    connectWallet,
    transactions,
    isLoading,
    addLandToBlockchain,
    handleChange,
    formData,
    checkIfWalletIsConnect,
    transferLandfunc,
  } = useContext(LandContext);

  const handleNewSubmit = async (e) => {
    e.preventDefault();

    const land = await getOneLand(landId);

    console.log('transfer Land identi number  : ', land.data.landIdentificationNumber);
    if (transferAmount * 1000 < 0.8 * predictionn) {
      console.log(
        'Amount is less than 80% of the predicted value So Case will is Filed!',
        0.8 * predictionn
      );
    }

    const transferData = {
      prevOwnerId: land.data.ownerId,
      currentAccount,
      currentOwnerId: newOwnerId,
      currentOwnerAddress: newOwnerAddress,
      landId: land.data.landIdentificationNumber,
      landIdBackend: land.data.id,
      landStatus: 'with new user',
      transferAmount,
    };
    const tempid = await transferLandfunc(transferData);

    const response = await createTransferLand(transferData);
    // console.log("response : ",response);
    if (response.status == 200) {
      navigate('/dashboard');
    } else console.log(response.error);
  };

  const handlePrediction = async () => {
    try {
      const response = await axios.post('http://localhost:5000/predict', {
        Area_SqFt: 1000,
        Floor_No: 2,
        Bedroom: 3,
      });
      setPrediction(response.data.prediction / 100);
      console.log('Predicted Price : ', response.data.prediction / 100, ' Cr');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    handlePrediction();
  }, []);

  return (
    <div
      className="h-screen flex flex-col justify-center items-center font object-cover"
      style={{
        backgroundImage: `url(
          "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        )`,
      }}
    >
      <Navbar />
      <div className="   m-20 p-10  flex flex-row items-center justify-center rounded-xl backdrop-brightness-90 w-1/3">
        <div className=" w-full flex flex-col md:flex-row  ">
          <div className="  w-full order-2 md:order-1">
            <div className="p-4 ">
              <h1 className="text-3xl font-bold mb-8 text-center">Transfer Land</h1>

              <form className="mb-4" onSubmit={handleNewSubmit}>
                <div className="mb-2">
                  <label htmlFor="newOwnerAddress" className="block mb-2 text-left font-semibold">
                    Address of the new owner
                  </label>
                  <input
                    type="text"
                    name="newOwnerAddress"
                    id="newOwnerAddress"
                    value={newOwnerAddress}
                    onChange={(e) => setNewOwnerAddress(e.target.value)}
                    placeholder="Enter the newOwnerAddress!"
                    className="w-full p-2 border border-gray-300 rounded-2xl mb-2 text-sm bg-blue-50 opacity-50"
                    required
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="newOwnerId" className="block mb-2 text-left font-semibold">
                    Id of the new owner
                  </label>
                  <input
                    type="text"
                    name="newOwnerId"
                    id="newOwnerId"
                    value={newOwnerId}
                    onChange={(e) => setNewOwnerId(e.target.value)}
                    placeholder="Enter the newOwnerId!"
                    className="w-full p-2 border border-gray-300 rounded-2xl mb-2 text-sm bg-blue-50 opacity-50"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="transferAmount" className="block mb-2 text-left font-semibold">
                    Add the Amount to Pay
                  </label>
                  <input
                    type="float"
                    name="transferAmount"
                    id="transferAmount"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="Enter the Area!"
                    className="w-full p-2 border border-gray-300 rounded-2xl mb-2 text-sm bg-blue-50 opacity-50"
                    required
                  />
                </div>
                {iserror ? (
                  <div class="px-1 my-2 text-sm text-red-500 rounded-lg" role="alert">
                    <span class="font-medium"> {'*' + error} </span>
                  </div>
                ) : (
                  <></>
                )}
                <button type="submit" className="bg-blue-800 text-white p-2 w-full rounded-2xl">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferLand;
