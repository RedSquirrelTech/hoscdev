const GreeterContract = artifacts.require("Greeter");

module.exports = function(deployer) {
  deployer.deploy(GreeterContract);
}
