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
import { getUserLands } from '../../Utils/API/landAPI';
import { fetchUserDetails, loginUser } from '../../Utils/API/authAPI';
import HeaderHome from '../../components/HeaderHome';
import { createInquiry } from '../../Utils/API/landInquiry';
import Navbar from '../../components/Navbar';

function LandDashboard() {
  const [isLoggedd, setisLoggedd] = useState(false);
  const [lands, setLands] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [clientId, setclientId] = useState('');
  const [userRole, setuserRole] = useState('');

  const {} = useContext(LandContext);

  const navigate = useNavigate();

  const getLands = async () => {
    const Token = getToken();
    const UserDetails = await fetchUserDetails(Token);
    setuserRole(UserDetails.data.role);
    setclientId(UserDetails.data.id);
    const tlands = await getUserLands(UserDetails);
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
  }, [10]);

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
            {userRole === 'ADMIN' ? (
              <button
                onClick={() => {
                  navigate('/dashboard/land/addland');
                }}
                className="flex flex-row p-4 px-36 mr-8 w-16 rounded-md bg-slate-600 hover:bg-slate-800 justify-center text-white text-nowrap"
              >
                Add New Land
              </button>
            ) : (
              // Button for other users to show lands
              <button
                onClick={() => {
                  navigate('/dashboard/land');
                }}
                className="flex flex-row p-4 px-36 mr-8 w-16 rounded-md bg-slate-600 hover:bg-slate-800 justify-center text-white text-nowrap"
              >
                Dashboard
              </button>
            )}
            <button
              onClick={() => {
                navigate('/dashboard/land/Market');
              }}
              className="flex p-4 px-36 mr-8 w-16 rounded-md bg-slate-600 hover:bg-slate-800 text-white justify-center text-nowrap"
            >
              Marketplace
            </button>
            <button
              onClick={() => {
                navigate('/dashboard/land/interested');
              }}
              className="flex p-4 px-36 mr-8 w-16 rounded-md bg-slate-600 hover:bg-slate-800 text-white justify-center text-nowrap"
            >
              Lands Status
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

      <p className="text-xl mt-8 m-4 font-bold">My Lands</p>

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
              onClick={() => {
                navigate(`/dashboard/land/enquiries/${land.id}`);
              }}
              className="px-4 pt-4 text-2xl font-bold hover:cursor-pointer"
            >
              Land Number : {land.landIdentificationNumber}
            </p>
            <p className="pl-4 ">{land.landType}</p>
            <p className="pl-4 ">Dimension : {land.dimensionOfLand}</p>
            <div className="flex flex-row">
              <p className="pl-4 ">{land.area},</p>
              <div className="flex flex-row items-center">
                <MdLocationPin className="ml-1" />
                <p>{land.location}</p>
              </div>
            </div>
          </div>
          <Link to={`/dashboard/land/enquiries/${land.id}`}>
            {/* <Link to={`/dashboard/land/transfer/${land.id}`}> */}
            <p className="p-4 text-lg font-bold">
              Owner: {`${land.ownerId.slice(0, 4)}...${land.ownerId.slice(-4)}`}
              <br></br>
              Current Rate: ₹{land.boughtPrice}/-
            </p>
          </Link>
          {/* <div><Market/></div> */}
        </div>
      ))}
    </div>
  );
}

export default LandDashboard;
