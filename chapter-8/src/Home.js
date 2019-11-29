
import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import FundraiserCard from './FundraiserCard'
import getWeb3 from "./utils/getWeb3";
import FactoryContract from "./contracts/Factory.json";
import Web3 from 'web3'

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));


const Home = () => {
  const classes = useStyles();
  const [ contract, setContract] = useState(null)
  const [ accounts, setAccounts ] = useState(null)
  const [ funds, setFunds ] = useState([])
  const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

  useEffect(() => {
    init()
  }, []);

  const init = async () => {
    try {
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = FactoryContract.networks[networkId];
      const accounts = await web3.eth.getAccounts();
      const instance = new web3.eth.Contract(
        FactoryContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      setContract(instance)
      setAccounts(accounts)

      const funds = await instance.methods.fundraisers().call()
      setFunds(funds)
    }
    catch(error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  const displayFundraisers = () => {
    return funds.map((fundraiser) => {
      return (
        <FundraiserCard
          fundraiser={fundraiser}
          key={fundraiser}
        />
      )
    })
  }

  return (
    <div className="main-container">
      {displayFundraisers()}
    </div>
  )
}

export default Home;
