const FactoryContract = artifacts.require("Factory");

module.exports = function(deployer) {
  deployer.deploy(FactoryContract);
}
