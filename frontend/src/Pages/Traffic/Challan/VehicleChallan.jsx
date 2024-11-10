import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/footer';
import { isLogin, logOut, getToken } from '../../../Utils/cookieSetup';
import { getVehicleChallans } from '../../../Utils/API/challanApi';

const VehicleChallan = () => {
  const [isLoggedd, setisLoggedd] = useState(false);
  const [challans, setChallans] = useState([]);
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const getChallansForVehicle = async () => {
    try {
      const challansData = await getVehicleChallans(vehicleId);
      setChallans(challansData);
    } catch (error) {
      console.error('Error fetching challans:', error);
    }
  };

  useEffect(() => {
    const checkLoginSession = isLogin();
    if (checkLoginSession) {
      setisLoggedd(true);
      getChallansForVehicle();
    } else {
      setisLoggedd(false);
      navigate('/login');
    }
  }, []);

  // Filter and sort unpaid and paid challans
  const unpaidChallans = challans
    .filter((challan) => !challan.status)
    .sort((a, b) => new Date(a.issueDate) - new Date(b.issueDate));
  const paidChallans = challans
    .filter((challan) => challan.status)
    .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));

  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 min-h-screen p-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate(`/dashboard/vehicle/${vehicleId}/challan/add`)}
            className="bg-blue-600 rounded-md mr-4 hover:bg-blue-700 text-white p-2 my-3"
          >
            + Add Challan
          </button>
          <div className="grid gap-8">
            {/* Unpaid Challans */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Unpaid Challans</h2>
              {unpaidChallans.map((challan) => (
                <div
                  key={challan.id}
                  className="bg-white overflow-hidden rounded-lg shadow-md md:flex my-4"
                >
                  <div className="px-6 py-8 md:w-1/2">
                    <h2 className="text-xl font-semibold">Challan ID: {challan.id}</h2>
                    <p className="text-gray-600">
                      Amount: {challan.amount}, Reason: {challan.reason}, Status:{' '}
                      {challan.status ? 'Paid' : 'Unpaid'}
                    </p>
                    <Link
                      to={`/dashboard/vehicle/${vehicleId}/challan/${challan.id}`}
                      className="inline-block max-w-xs mt-4 px-3 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                    >
                      Pay Challan
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {/* Paid Challans */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Paid Challans</h2>
              {paidChallans.map((challan) => (
                <div
                  key={challan.id}
                  className="bg-white overflow-hidden rounded-lg shadow-md md:flex my-4"
                >
                  <div className="px-6 py-8 md:w-1/2">
                    <h2 className="text-xl font-semibold">Challan ID: {challan.id}</h2>
                    <p className="text-gray-600">
                      Amount: {challan.amount}, Reason: {challan.reason}, Status:{' '}
                      {challan.status ? 'Paid' : 'Unpaid'}
                    </p>
                    <Link
                      to={`https://sepolia.etherscan.io/tx/${challan.transactionHash}`}
                      className="inline-block max-w-xs mt-4 px-3 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                    >
                      View Receipt
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VehicleChallan;
