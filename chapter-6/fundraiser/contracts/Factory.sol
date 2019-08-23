pragma solidity >0.4.23 <0.7.0;

import "./Fundraiser.sol";

contract Factory {

    Fundraiser[] private _fundraisers;
    event LogFundraiserCreated(address indexed fundraiser, string indexed name);

    function createFundraiser(
        string memory name,
        string memory url,
        string memory imageURL,
        string memory bio,
        address payable beneficiary,
        address custodian
    ) public {
        Fundraiser fundraiser = new Fundraiser(
            name,
            url,
            imageURL,
            bio,
            beneficiary,
            custodian
        );
        _fundraisers.push(fundraiser);
        emit LogFundraiserCreated(address(fundraiser), name);
    }

    function fundraisersCount() public view returns(uint256) {
        return _fundraisers.length;
    }

    function fundraisers() public view returns(Fundraiser[] memory fs) {
        uint256 count = fundraisersCount();
        fs = new Fundraiser[](count);
        for(uint256 i = 0; i < count; i++) {
            fs[i] = _fundraisers[i];
        }
        return fs;
    }
}
