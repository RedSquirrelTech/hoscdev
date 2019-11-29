
import React, { useState, useEffect } from "react";
import FactoryContract from "./contracts/Factory.json";
import getWeb3 from "./utils/getWeb3";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";

import NewFundraiser from './NewFundraiser'
import Home from './Home'
import Receipts from './Receipts'

import "./App.css";

const App = () => {
  const [state, setState] = useState({web3: null, accounts: null, contract: null});
  const [storageValue, setStorageValue] = useState(0);

  useEffect(() => {
    const init = async() => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = FactoryContract.networks[networkId];
        const instance = new web3.eth.Contract(
          FactoryContract.abi,
          deployedNetwork && deployedNetwork.address,
        );

        // Set web3, accounts, and contract to the state, and then proceed with an
        setState({web3, accounts, contract: instance});

      } catch(error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    }
    init();
  }, []);

  const useStyles = makeStyles({
    root: {
      flexGrow: 1,
    },
  });

  const classes = useStyles();

  const runExample = async () => {
    const { accounts, contract } = state;
  };

  return (
    <div>
      <Router>
        <AppBar position="static" color="default" style={{ margin: 0 }}>
          <Toolbar>
           <Typography variant="h6" color="inherit">
             <NavLink className="nav-link" to="/">Home</NavLink>
           </Typography>
           <NavLink className="nav-link" to="/new/">New</NavLink>
          </Toolbar>
       </AppBar>

        <Route path="/" exact component={Home} />
        <Route path="/new/" component={NewFundraiser} />
        <Route path="/receipts" component={Receipts} />
      </Router>
    </div>
  )
}


export default App;
