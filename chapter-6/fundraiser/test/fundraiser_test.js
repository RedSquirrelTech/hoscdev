const FundraiserContract = artifacts.require("Fundraiser");

contract("Fundraiser", accounts => {
  describe("initialization", () => {
    let fundraiser;
    const custodianAddress = accounts[0];

    // beneficiary info
    const beneficiary = {
      name: "Beneficiary Name",
      ethereumAccount: accounts[1],
      websiteURL: "https://beneficiary.org",
      imageURL: "http://www.placepuppy.net/400/250",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum augue enim, consectetur quis dui quis, placerat pellentesque urna. Proin sodales eleifend quam. Morbi rutrum sapien odio, pellentesque viverra enim congue lobortis. Vivamus ac purus eget neque tincidunt euismod. Vestibulum urna risus, commodo vitae eros nec, aliquam porta urna. Nam tristique ligula ut massa rhoncus, nec pretium ante volutpat. Vestibulum nulla odio, gravida sit amet interdum vel, consectetur a nunc. Duis euismod hendrerit velit, et scelerisque est."
    }

    beforeEach(async () => {
      fundraiser = await FundraiserContract.new(
        beneficiary.name,
        beneficiary.ethereumAccount,
        beneficiary.websiteURL,
        beneficiary.imageURL,
        beneficiary.bio,
        custodianAddress);      
    });

    it("sets the beneficiary name", async () => {
      const actual = await fundraiser.name();
      assert.equal(actual, beneficiary.name, "names should match");
    });

    it("sets the beneficiary address", async () => {
      const actual = await fundraiser.beneficiary();
      assert.equal(actual, beneficiary.ethereumAccount, "addresses should match");
    });

    it("sets the beneficiary website URL", async () => {
      const actual = await fundraiser.url();
      assert.equal(actual, beneficiary.websiteURL, "URLs should match");
    });

    it("sets the beneficiary image URL", async () => {
      const actual = await fundraiser.imageURL();
      assert.equal(actual, beneficiary.imageURL, "image URLs should match");
    });

    it("sets the beneficiary bio", async () => {
      const actual = await fundraiser.bio();
      assert.equal(actual, beneficiary.bio, "bios should match");
    });
  })
});
