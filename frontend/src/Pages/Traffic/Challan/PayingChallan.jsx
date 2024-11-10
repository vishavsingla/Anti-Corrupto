import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { isLogin, logOut, getToken } from '../../../Utils/cookieSetup';
import { fetchUserDetails } from '../../../Utils/API/authAPI';
import { addChallan, getChallansById, updateChallanStatus } from '../../../Utils/API/challanApi';
import { ChallanContext } from '../../../context/ChallanContext';

function PayingChallan() {
  const { payChallan, getUserChallansfunc } = useContext(ChallanContext);
  const [isLoggedd, setisLoggedd] = useState(false);
  const { vehicleId, challanId } = useParams();
  const navigate = useNavigate();

  const challan = async (challanId) => {
    try {
      const challanData = await getChallansById(challanId);
      // console.log('chalan ki ki', challanData);
      // console.log(challanData.challanIdBlockchain);
      const challanstatus = await payChallan(challanData);
      // const challanstatus = 200;
      if (challanstatus == 200) {
        await updateChallanStatus(challanData.id);
        navigate('/dashboard/vehicle/' + vehicleId + '/challan');
      } else {
        console.log('Error paying challan');
        error('Error paying challan');
      }
      // let metamask_address = '0x2Bf6A37145e08a1E556891D7dE6f5c2cCEAf457C';
      // let f = getUserChallansfunc(metamask_address);
      // console.log('challan in getuserchallanfunc', f);
    } catch (error) {
      console.error('Error fetching challans:', error);
    }
  };

  useEffect(() => {
    const checkLoginSession = isLogin();
    if (checkLoginSession) {
      setisLoggedd(true);
      const challanData = challan(challanId);
    } else {
      setisLoggedd(false);
      navigate('/login');
    }
  }, [10]);

  return <div>PayingChallan</div>;
}

export default PayingChallan;
