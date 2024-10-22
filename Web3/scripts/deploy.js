const main = async () => {
  const vehicleFactory = await hre.ethers.getContractFactory(
    "ChallanManagement"
  );
  const vehicleContract = await vehicleFactory.deploy();

  await vehicleContract.waitForDeployment();
    const myAddress = await vehicleContract.getAddress();
  console.log("Transactions address: ",myAddress);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();