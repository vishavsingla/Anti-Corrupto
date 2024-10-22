import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/footer';
import { getUserVehicles } from '../../../Utils/API/vehicleApi';
import { isLogin, getToken } from '../../../Utils/cookieSetup';
import { fetchUserDetails } from '../../../Utils/API/authAPI';
import { useNavigate } from 'react-router-dom';

const VehiclesPage = () => {
  const [isLoggedd, setIsLoggedd] = useState(false);
  const [myUser, setMyUser] = useState('');
  const [userRole, setUserRole] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  const getallvehicles = async () => {
    const myToken = getToken();
    console.log('token', myToken);
    const thisUser = await fetchUserDetails(myToken);
    console.log('User Details Dashboard : ', thisUser);
    setMyUser(thisUser.data.id);
    setUserRole(thisUser.data.role); // Assuming role is returned as `role`
    const myvehicles = await getUserVehicles(thisUser.data.id);
    setVehicles(myvehicles);
  };

  useEffect(() => {
    const checkLoginSession = isLogin();
    if (checkLoginSession) {
      setIsLoggedd(true);
      getallvehicles();
    } else {
      setIsLoggedd(false);
      navigate('/login');
    }
  }, []);

  return (
    <div>
      <div className="flex-col space-y-5">
        <Navbar />
      </div>
      <div className="flex flex-row  h-[600px] m-10 ">
        <div
          className="w-1/2 h-full bg-cover bg-center"
          style={{
            backgroundImage: `url("https://img.freepik.com/free-vector/endpoint-concept-illustration_114360-2583.jpg?t=st=1726464512~exp=1726468112~hmac=448e5476c89f99a2ffc17a14865cc2a039b3d957bb30d732cae479fe46297c0a&w=740")`,
          }}
        ></div>
        <div className="w-1/2 text-center content-center font-mono text-lg hidden sm:block">
          <p className="font-bold">Hi, Anti-Corrupto User</p>
          <br />
          <br />
          <p>This page contains information about your existing vehicle(s)</p>
          <br />
          <p>
            You can add a new vehicle into your collection by clicking on <b>Add Vehicle</b> button
            {userRole === 'ADMIN' && (
              <>
                <br />
                <button
                  onClick={() => {
                    navigate('/dashboard/vehicle/add');
                  }}
                  className="bg-sky-800 rounded-md mr-4 hover:bg-sky-900 hover:shadow-xl text-white p-2 my-3"
                >
                  + Add Vehicle
                </button>
              </>
            )}
          </p>
          <br />
          <p>Always stay up to date with the challans on vehicle(s) you own</p>
          <br />
          <p>Have a check on regular basis</p>
          <br />
          <p>Scroll down for further details </p>
        </div>
      </div>
      <div className="min-h-screen p-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="overflow-hidden rounded-lg shadow-md md:flex bg-white"
              >
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="mx-auto h-full w-1/3 border-2 border-black rounded-lg"
                />
                <div
                  className="px-6 py-8 md:w-2/3 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("https://img.freepik.com/free-vector/seamless-white-interlaced-rounded-arc-patterned-background_53876-97975.jpg?t=st=1726463373~exp=1726466973~hmac=c49043de1b7a2ad8f527ea803fca1c9d566dbcd2376dae01fdc2f37d065b4ed1&w=996")`,
                  }}
                >
                  <h2 className="text-lg font-semibold">Vehicle Number: {vehicle.plateNumber}</h2>
                  <p className="text-gray-600">
                    Year: <b>{vehicle.year}</b>, Company: <b>{vehicle.make}</b>, Model: <b>{vehicle.model}</b>, Color: <b>{vehicle.color}</b>
                  </p>
                  <div className="flex flex-row justify-between">
                    <button
                      className="mt-4 px-3 py-2 bg-sky-800 hover:bg-sky-900 hover:shadow-xl text-white rounded shadow"
                      onClick={() => {
                        navigate(`/dashboard/vehicle/view/${vehicle.id}`);
                      }}
                    >
                      View Details
                    </button>
                    <button
                      className="mt-4 px-3 py-2 bg-sky-800 hover:bg-sky-900 hover:shadow-xl text-white rounded shadow"
                      onClick={() => {
                        navigate(`/dashboard/vehicle/${vehicle.id}/challan`);
                      }}
                    >
                      Challans
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VehiclesPage;
