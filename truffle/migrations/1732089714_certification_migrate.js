const Certification = artifacts.require("Certification");
module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(Certification)
};
