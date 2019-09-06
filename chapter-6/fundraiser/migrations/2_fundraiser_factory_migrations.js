const FundraiserFactoryContract = artifacts.require("FundraiserFactory");

module.exports = function(deployer) {
  deployer.deploy(FundraiserFactoryContract);
}
