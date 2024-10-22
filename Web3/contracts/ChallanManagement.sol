// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ChallanManagement {
    address public owner;
    uint64 public userChallanCount;
    uint64 public vehicleChallanCount;

    struct Challan {
        uint256 challanId;
        uint256 vehicleId;
        uint256 amount;
        bool paid;
        string reason;
        uint256 issueDate;
        string location;
    }

    mapping(address => Challan[]) public Challans;
    mapping(uint256 => Challan) public allChallans;

    event ChallanIssued(
        address indexed user,
        uint256 challanId,
        uint256 vehicleId,
        uint256 amount,
        string reason,
        string location,
        uint256 issueDate
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function parseAndConvert(string memory input) public pure returns (uint256) {
        uint256 result;
        assembly {
            result := mload(add(input, 32))
        }
        return result;
    }

    function issueChallan(
        string memory _vehicleId,
        string memory _amount,
        string memory _reason,
        string memory _location
    ) public {
        uint256 challanId = uint256(
            keccak256(abi.encodePacked(msg.sender, block.timestamp))
        );

        uint256 __vehicleId = parseAndConvert(_vehicleId);
        uint256 __amount = parseAndConvert(_amount);

        uint256 issueDate = timeCall();

        Challan memory newChallan = Challan(
            challanId,
            __vehicleId,
            __amount,
            false,
            _reason,
            issueDate,
            _location
        );
        userChallanCount += 1;

        Challans[msg.sender].push(newChallan);
        allChallans[challanId]=newChallan;

        emit ChallanIssued(
            msg.sender,
            challanId,
            __vehicleId,
            __amount,
            _reason,
            _location,
            issueDate
        );
    }

    function timeCall() public view returns (uint256) {
        return block.number;
    }
    event ChallanPaid(address indexed payer, uint256 challanId, uint256 amount);

    function payChallan(uint256 _challanId) public {
        Challan storage challan = allChallans[_challanId];
        require(!challan.paid, "Challan already paid");
        challan.paid = true;
        emit ChallanPaid(msg.sender, challan.challanId, challan.amount);
    }

    function getUserChallans(
        address _userAddress
    ) public view returns (Challan[] memory) {
        return Challans[_userAddress];
    }

    function getUserLastChallan(
        address _userAddress
    ) public view returns (Challan memory) {
        Challan[] memory userChallans = Challans[_userAddress];
        require(userChallans.length > 0, "No challans found for this user");
        return userChallans[userChallans.length - 1];
    }


    function getChallanDetails(
        uint256 _challanId
    ) public view returns (Challan memory) {
        // uint256 challanId = parseAndConvert(_challanId);
        return allChallans[_challanId];
    }
    
    function getUserChallanCount() public view returns (uint64) {
        return userChallanCount;
    }

    function getVehicleChallanCount(
        string memory _vehicleId
    ) public view returns (uint256) {
        uint256 vehicleId = parseAndConvert(_vehicleId);
        uint256 count = 0;
        for (uint256 i = 0; i < Challans[msg.sender].length; i++) {
            if (Challans[msg.sender][i].vehicleId == vehicleId) {
                count++;
            }
        }
        return count;
    }

    function getChallansForVehicle(
        string memory _vehicleId
    ) public view returns (Challan[] memory) {
        uint256 vehicleId = parseAndConvert(_vehicleId);
        Challan[] memory vehicleChallans = new Challan[](
            getVehicleChallanCount(_vehicleId)
        );
        uint256 index = 0;
        for (uint256 i = 0; i < Challans[msg.sender].length; i++) {
            if (Challans[msg.sender][i].vehicleId == vehicleId) {
                vehicleChallans[index] = Challans[msg.sender][i];
                index++;
            }
        }
        return vehicleChallans;
    }
}