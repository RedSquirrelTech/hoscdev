pragma solidity >0.4.23 <0.7.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Fundraiser is Ownable {
    string private _name;
    string private _url;
    string private _imageURL;
    string private _bio;

    address payable _beneficiary;

    uint256 private _totalDonations = 0;
    uint256 private _donationsCount = 0;

    struct Donation {
        uint256 value;
        string date;
        uint256 conversionFactor;
    }
    event LogDonationReceived(address from, uint256 value, string date);
    mapping(address => Donation[]) private _donations;

    constructor(
        string memory name,
        string memory url,
        string memory imageURL,
        string memory bio,
        address payable beneficiary,
        address custodian) public {
        _name = name;
        _beneficiary = beneficiary;
        _url = url;
        _imageURL = imageURL;
        _bio= bio;

        _transferOwnership(custodian);
    }

    function name() public view returns(string memory) {
        return _name;
    }

    function beneficiary() public view returns(address payable) {
        return _beneficiary;
    }

    function url() public view returns(string memory) {
        return _url;
    }

    function imageURL() public view returns(string memory) {
        return _imageURL;
    }

    function bio() public view returns(string memory) {
        return _bio;
    }

    function totalDonations() public view returns(uint256) {
        return _totalDonations;
    }

    function donate(uint256 conversionFactor, string memory date) public payable {
        Donation memory donation = Donation({
            value: msg.value,
            conversionFactor: conversionFactor,
            date: date
        });

        _donations[msg.sender].push(donation);
        _totalDonations += msg.value;
        _donationsCount += 1;

        emit LogDonationReceived(msg.sender, msg.value, date);
    }

    function donationsCount() public view returns(uint256) {
        return _donationsCount;
    }
}
