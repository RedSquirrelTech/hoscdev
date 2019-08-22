const FundraiserContract = artifacts.require("Fundraiser");

contract("Fundraiser", accounts => {
  let fundraiser;
  const custodianAddress = accounts[0];
  const beneficiary = {
    name: "Beneficiary Name",
    ethereumAccount: accounts[1],
    websiteURL: "https://beneficiary.org",
    imageURL: "http://www.placepuppy.net/400/250",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum augue enim, consectetur quis dui quis, placerat pellentesque urna. Proin sodales eleifend quam. Morbi rutrum sapien odio, pellentesque viverra enim congue lobortis. Vivamus ac purus eget neque tincidunt euismod. Vestibulum urna risus, commodo vitae eros nec, aliquam porta urna. Nam tristique ligula ut massa rhoncus, nec pretium ante volutpat. Vestibulum nulla odio, gravida sit amet interdum vel, consectetur a nunc. Duis euismod hendrerit velit, et scelerisque est."
  };

  describe("initialization", () => {
    beforeEach(async () => {
      fundraiser = await createFundraiser(beneficiary, custodianAddress);
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

    it("sets the owner", async () => {
      const actual = await fundraiser.owner();
      assert.equal(actual, custodianAddress, "ownership should match custodian");
    });
  })

  describe("making a donation", () => {
    const donoationAmount = web3.utils.toWei('0.1');
    const conversionRate = 18460;
    const date = new Date().valueOf();
    const donor = accounts[2];

    beforeEach(async () => {
      fundraiser = await createFundraiser(beneficiary, custodianAddress);
    });

    it ("increases total donations amount", async () => {
      const currentValue = await fundraiser.totalDonations();
      await fundraiser.donate(conversionRate, date, {from: donor, value: donoationAmount});
      const updatedValue = await fundraiser.totalDonations();

      const difference = updatedValue - currentValue;

      assert.equal(donoationAmount, difference, "amount should change by donated amount");
    });

    it ("increases donations count", async () => {
      const currentDonationsCount = await fundraiser.donationsCount();
      await fundraiser.donate(conversionRate, date, {from: donor, value: donoationAmount});
      const updatedDonationsCount = await fundraiser.donationsCount();

      const difference = updatedDonationsCount - currentDonationsCount;

      assert.equal(1, difference, "donations count should change by 1");
    });

    it ("emits donation received event", async () => {
      const transaction = await fundraiser.donate(
        conversionRate,
        date,
        {from: donor, value: donoationAmount}
      );
      const expectedEvent = "LogDonationReceived";
      const actualEvent = transaction.logs[0].event;
      assert.equal(actualEvent, expectedEvent, "events should match");
    });

    it("returns my donations", async () => {
      await fundraiser.donate(conversionRate, date, {from: donor, value: donoationAmount});
      const myDonations = await fundraiser.myDonations({from: donor});

      assert.equal(myDonations.values[0], donoationAmount)
      assert.equal(myDonations.dates[0], date)
      assert.equal(myDonations.conversionFactors[0], conversionRate);
    });
  });
});

async function createFundraiser(beneficiary, custodian) {
  return await FundraiserContract.new(
    beneficiary.name,
    beneficiary.websiteURL,
    beneficiary.imageURL,
    beneficiary.bio,
    beneficiary.ethereumAccount,
    custodian
  );      
}
