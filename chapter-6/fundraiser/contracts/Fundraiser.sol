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
        uint256 date;
        uint256 conversionFactor;
    }
    event LogDonationReceived(address from, uint256 value, uint256 date);
    mapping(address => Donation[]) private _donations;

    event LogWithdraw(uint amount);

    constructor(
        string memory name,
        string memory url,
        string memory imageURL,
        string memory bio,
        address payable beneficiary,
        address custodian) public {
        _name = name;
        _url = url;
        _imageURL = imageURL;
        _bio= bio;
        _beneficiary = beneficiary;

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

    function donate(uint256 conversionFactor) public payable {
        Donation memory donation = Donation({
            value: msg.value,
            conversionFactor: conversionFactor,
            date: now
        });

        _donations[msg.sender].push(donation);
        _totalDonations += msg.value;
        _donationsCount += 1;

        emit LogDonationReceived(msg.sender, msg.value, donation.date);
    }

    function donationsCount() public view returns(uint256) {
        return _donationsCount;
    }

    function myDonations() public view returns(
        uint256[] memory values,
        uint256[] memory dates,
        uint256[] memory conversionFactors)
    {
        uint256 count = _donations[msg.sender].length;
        values = new uint256[](count);
        dates = new uint256[](count);
        conversionFactors = new uint256[](count);

        for(uint256 i = 0; i < count; i++) {
            values[i] = _donations[msg.sender][i].value;
            dates[i] = _donations[msg.sender][i].date;
            conversionFactors[i] = _donations[msg.sender][i].conversionFactor;
        }
        return (values, dates, conversionFactors);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        _beneficiary.transfer(balance);
        emit LogWithdraw(balance);
    }
}
