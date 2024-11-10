import React, { useState, useEffect, useContext } from 'react';
import { MdLocationPin } from 'react-icons/md';
import { IoSearchSharp } from 'react-icons/io5';
import { BiCategory } from 'react-icons/bi';
import { FaCaretDown } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';
import { setSessionToken, isLogin, getCookie, getToken } from '../../Utils/cookieSetup';
import { useNavigate } from 'react-router-dom';
import { LandContext } from '../../context/LandContext';
import { Link } from 'react-router-dom';
import { fetchUserDetails, loginUser } from '../../Utils/API/authAPI';
import HeaderHome from '../../components/HeaderHome';
import { getUserInterestedLands } from '../../Utils/API/landInquiry';
import { createTransferLand } from '../../Utils/API/transferAPI';
import Navbar from '../../components/Navbar';

function UserLandInterest() {
  const [isLoggedd, setisLoggedd] = useState(false);
  // const { checkIfWalletIsConnect } = useContext(LandContext);
  const [lands, setLands] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [clientId, setclientId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedLand, setSelectedLand] = useState(null);

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

  const navigate = useNavigate();

  const getLands = async () => {
    const Tocken = getToken();
    const UserDetails = await fetchUserDetails(Tocken);
    setclientId(UserDetails.data.id);
    const tlands = await getUserInterestedLands(UserDetails.data.id);
    setLands(tlands);
  };
  useEffect(() => {
    const checkLoginSession = isLogin();
    if (checkLoginSession) {
      setisLoggedd(true);
      getLands();
    } else {
      setisLoggedd(false);
      navigate('/login');
    }
    checkIfWalletIsConnect();
  }, []);

  const handleInterestedClick = (land) => {
    setSelectedLand(land); // Set selected land

    setShowModal(true); // Show modal
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLand(null); // Clear selected land
  };

  const confirmInterest = async () => {
    const formData = {
      landId: selectedLand.land.web3Id,
      landIdWeb3: selectedLand.land.web3Id,
      landIdBackend: selectedLand.land.id,
      prevOwnerId: selectedLand.land.ownerId,
      currentOwnerId: clientId,
      transferAmount: selectedLand.land.boughtPrice,
    };

    // const transactionConfirmations = await transferLandfunc(formData);
    const transactionConfirmations = 200;

    if (transactionConfirmations === 200) {
      setShowModal(false);
      const response = await createTransferLand(formData);
      console.log(response);
      if (response.status == 200) {
        alert('Land Transfer Successful');
      } else console.log(response.error);
    } else {
      console.log('Land Transfer Failed');
    }
  };
  return (
    <div className="h-full flex items-center flex-col justify-start bg-cover">
      <Navbar />
      <div
        className="flex flex-col w-full h-96 md:h-auto bg-slate-700 object-fill bg-cover justify-center items-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgb(255, 255, 255)), url("https://images.unsplash.com/photo-1591389703635-e15a07b842d7?q=80&w=2833&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
        }}
      >
        <p className=" bg-center text-white text-5xl py-20 font-bold drop-shadow-xl">
          <TypeAnimation
            sequence={[
              'Anti - Corruptō',
              4000,
              'Anti - Tampering',
              1500,
              'Anti - Fraudulent',
              1500,
              'Anti - Dispute',
              1500,
              'Anti - Manipulation',
              1500,
              'Anti - Falsification',
              1500,
              'Anti - Counterfeit',
              1500,
            ]}
            wrapper="span"
            speed={50}
            style={{ fontSize: '50px', display: 'inline-block' }}
            className="drop-shadow-xl"
            repeat={Infinity}
          />
        </p>

        <div className="flex flex-col p-5 w-full items-center justify-center">
          <div className="flex flex-row mb-6 w-full justify-center items-center">
            <div
              className="h-12 p-4 flex flex-row ml-12 justify-center text-sm items-center bg-slate-800 rounded-xl text-white shadow-xl"
              // style={{ whiteSpace: "nowrap" }}
            >
              <select
                name="sortBy"
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className=" p-2 px-4 text-white bg-slate-800"
                required
              >
                <option value="" disabled selected>
                  Sort By
                </option>
                <option value="1">Land Type</option>
                <option value="2">Price</option>
                <option value="3">Area</option>
                <option value="4">Location</option>
                {/* <option value="5">Residential</option> */}
              </select>
            </div>

            <input
              type="text"
              className="h-12 ml-2 pl-4 w-full rounded-l-xl border-2 border-r-0 shadow-xl"
              placeholder="Search for property by Location, Owner name...."
            />
            <div className="h-12 p-4 flex mr-14 justify-center items-center bg-slate-800 rounded-r-xl cursor-pointer text-white shadow-xl">
              Search
              <IoSearchSharp className="text-white ml-2" />
            </div>
          </div>

          <div className="mx-12 flex flex-row justify-center ">
            <button
              onClick={() => {
                navigate('/dashboard/land/addland');
              }}
              className="flex flex-row  p-4 px-36 mr-8 w-16 rounded-md bg-slate-600 hover:bg-slate-800 justify-center text-white text-nowrap"
            >
              Add New Land
            </button>
            <button
              onClick={() => {
                navigate('/dashboard/land/Market');
              }}
              className="flex p-4 px-36 mr-8 w-16 rounded-md bg-slate-600 hover:bg-slate-800 text-white justify-center text-nowrap"
            >
              Marketplace
            </button>
            <button className="flex p-4 px-36 mr-8 w-16 rounded-md bg-slate-600 hover:bg-slate-800 text-white justify-center text-nowrap">
              Transfer Land
            </button>
            <button
              onClick={() => {
                navigate('/dashboard/land/cases');
              }}
              className="flex p-4 px-36 rounded-md w-16 bg-slate-600 hover:bg-slate-800 text-white justify-center text-nowrap"
            >
              Cases
            </button>
          </div>
        </div>
      </div>

      <p className="text-xl mt-8 m-4 font-bold">My Interests</p>

      {lands.map((land, index) => (
        <div
          key={index}
          className="flex flex-col w-2/3 h-72 bg-slate-700 rounded-lg m-4 object-fill bg-cover  justify-between shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0), rgb(255, 255, 255)), url(https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D})`,
          }}
        >
          <div>
            <p
              // onClick={() => {
              //   navigate(`/dashboard/land/transfer/${land.landId}`);
              // }}
              className="px-4 pt-4 text-2xl font-bold"
            >
              Land Number : {land.land.landIdentificationNumber}
            </p>
            {land.landType === 0 ? (
              <p className="pl-4 ">Government</p>
            ) : land.landType == 1 ? (
              <p className="pl-4 ">Commercial</p>
            ) : land.landType == 2 ? (
              <p className="pl-4 ">Agricultural</p>
            ) : land.landType == 3 ? (
              <p className="pl-4 ">Industrial</p>
            ) : (
              <p className="pl-4 ">Residential</p>
            )}
            <p className="pl-4 ">Dimension : {land.land.dimensionOfLand}</p>
            <div className="flex flex-row">
              <p className="pl-4 ">{land.land.area},</p>
              <div className="flex flex-row items-center">
                <MdLocationPin className="ml-1" />
                <p>{land.land.location}</p>
              </div>
            </div>
          </div>
          {/* <Link to={`/dashboard/land/transfer/${land.id}`}> */}
          <p className="p-4 text-lg font-bold">
            Owner: {`${land.land.ownerId.slice(0, 4)}...${land.land.ownerId.slice(-4)}`}
            <br></br>
            Current Rate: ₹{land.land.boughtPrice}/-
            <br></br>
            Status: {land.status}
          </p>
          {/* </Link> */}
          {land.status === 'APPROVED' ? (
            <button
              onClick={() => handleInterestedClick(land)}
              className="p-2 m-4 w-50 bg-slate-600 hover:bg-slate-800 text-white"
            >
              Pay The Dues
            </button>
          ) : (
            <></>
          )}
        </div>
      ))}
      {/* Modal Section */}
      {showModal && selectedLand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">
              Confirm Interest in Buying {selectedLand.landId}
            </h2>
            <p>Are you sure you want to express interest in purchasing this land?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmInterest}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserLandInterest;
