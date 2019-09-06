pragma solidity >0.4.23 <0.7.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Fundraiser is Ownable {
    struct Donation {
        uint256 value;
        uint256 conversionFactor;
        uint256 date;
    }
    mapping(address => Donation[]) private _donations;
    event LogDonationReceived(address indexed donor, uint256 value);
    uint256 private _totalDonations;
    uint256 private _donationsCount;

    event LogWithdraw(uint256 amount);

    string private _name;
    string private _url;
    string private _imageURL;
    string private _bio;

    address payable private _beneficiary;
    address private _owner;

    constructor(
        string memory name,
        string memory url,
        string memory imageURL,
        string memory bio,
        address payable beneficiary,
        address custodian
    )
        public
    {
        _name = name;
        _url = url;
        _imageURL = imageURL;
        _bio = bio;
        _beneficiary = beneficiary;
        _owner = custodian;
    }

    function name() public view returns(string memory) {
        return _name;
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

    function beneficiary() public view returns(address payable) {
        return _beneficiary;
    }

    function myDonationsCount() public view returns(uint256) {
        return _donations[msg.sender].length;
    }

    function myDonations() public view returns(
        uint256[] memory values,
        uint256[] memory conversionFactors,
        uint256[] memory dates
    )
    {
        uint256 count = myDonationsCount();
        values = new uint256[](count);
        conversionFactors = new uint256[](count);
        dates = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            Donation storage donation = _donations[msg.sender][i];
            values[i] = donation.value;
            conversionFactors[i] = donation.conversionFactor;
            dates[i] = donation.date;
        }

        return (values, conversionFactors, dates);
    }

    function donate(uint256 conversionFactor) public payable {
        Donation memory donation = Donation({
            value: msg.value,
            conversionFactor: conversionFactor,
            date: block.timestamp
        });

        _donations[msg.sender].push(donation);
        _totalDonations += msg.value;
        _donationsCount++;

        emit LogDonationReceived(msg.sender, msg.value);
    }

    function totalDonations() public view returns(uint256) {
        return _totalDonations;
    }

    function donationsCount() public view returns(uint256) {
        return _donationsCount;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        _beneficiary.transfer(balance);
        emit LogWithdraw(balance);
    }
}
