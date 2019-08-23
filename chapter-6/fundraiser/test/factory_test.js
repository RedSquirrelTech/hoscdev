const FactoryContract = artifacts.require("Factory");
const FundraiserContract = artifacts.require("Fundraiser");
const faker = require("faker");

contract("FactoryContract", accounts => {
  let factoryContract;

  beforeEach(async () => {
    factoryContract = await FactoryContract.deployed();
  });

  it("deploys to test network", async () => {
    assert(factoryContract, "deployed successfully");
  });
});

contract("FactoryContract: createFundraiser", accounts => {
  let factoryContract;
  const custodian = accounts[0];
  const beneficiary = accounts[1];
  const name = faker.company.companyName();
  const website = faker.internet.url();
  const imageURL = faker.image.imageUrl(400, 250);
  const bio = faker.lorem.paragraph(2);
  
  beforeEach(async () => {
    factoryContract = await FactoryContract.deployed();
  });

  it("increases fundraisers count", async () => {
    const fundraisersCount = await factoryContract.fundraisersCount();
    await factoryContract.createFundraiser(name, website, imageURL, bio, beneficiary, custodian);
    const newFundraisersCount = await factoryContract.fundraisersCount();

    const difference = newFundraisersCount - fundraisersCount;
    assert.equal(difference, 1, "count should increment by 1");
  });

  it("emits new fundraiser event", async () => {

    const transaction = await factoryContract.createFundraiser(
      name,
      website,
      imageURL,
      bio,
      beneficiary,
      custodian
    );
    const actualEvent = transaction.logs[0].event;
    const expectedEvent = "LogFundraiserCreated";

    assert.equal(actualEvent, expectedEvent, "fundraiser created event should be emitted");
  });
});

contract("Factory: fundraisers", async (accounts) => {
  let names, images, factoryContract;
  beforeEach(async () => {
    factoryContract = await FactoryContract.deployed();
    names = [];
    images = [];

    for (let i = 0; i < 3; i++) {
      custodian = accounts[0];
      beneficiary = accounts[1];
      name = faker.company.companyName();
      website = faker.internet.url();
      imageURL = faker.image.imageUrl(400, 250);
      bio = faker.lorem.paragraph(2);

      const tx = await factoryContract.createFundraiser(name, website, imageURL, bio, beneficiary, custodian);

      names.push(name);
      images.push(imageURL);
    }
  });

  it("provides summaries for existing fundraisers", async () => {
    const results = await factoryContract.fundraisers();
    const fundraiser = await FundraiserContract.at(results[0]);
    const fundraiserName = await fundraiser.name();

    names.find(name => name === fundraiserName);
    assert(fundraiserName, "name is in list");
  });
});
