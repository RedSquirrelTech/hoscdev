import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';

import getWeb3 from "./utils/getWeb3";
import FundraiserContract from "./contracts/Fundraiser.json";
import Web3 from 'web3'

import { Link } from 'react-router-dom'

const cc = require('cryptocompare')

const getModalStyle =() => {
  const top = 50;
  const left = 50;

  return {
    top,
    left,
  };
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    display: 'table-cell'
  },
  card: {
    maxWidth: 450,
    height: 400
  },
  media: {
    height: 140,
  },
  paper: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    boxShadow: 'none',
    padding: 4,
  },
}));

const FundraiserCard = (props) => {
  const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

  const [ contract, setContract] = useState(null)
  const [ accounts, setAccounts ] = useState(null)
  const [ fund, setFundraiser ] = useState(null)
  const [ fundName, setFundname ] = useState(null)
  const [ bio, setBio ] = useState(null)
  const [ totalDonations, setTotalDonations ] = useState(null)
  const [ imageURL, setImageURL ] = useState(null)
  const [ url, setURL ] = useState(null)
  const [ open, setOpen] = React.useState(false);
  const [ donationAmount, setDonationAmount] = useState(null)
  const [ exchangeRate, setExchangeRate ] = useState(null)
  const [ userDonations, setUserDonations ] = useState(null)
  const [ isOwner, setIsOwner ] = useState(false)

  const ethAmount = (donationAmount / exchangeRate || 0).toFixed(4)

  const { fundraiser } = props

  const classes = useStyles();

  useEffect(() => {
    if (fundraiser) {
      init(fundraiser)
    }
  }, [fundraiser]);

  const init = async (fundraiser) => {
    try {
      const fund = fundraiser
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = FundraiserContract.networks[networkId];
      const accounts = await web3.eth.getAccounts();
      const instance = new web3.eth.Contract(
        FundraiserContract.abi,
        fund
      );
      setContract(instance)
      setAccounts(accounts)

      const name = await instance.methods.name().call()
      const bio = await instance.methods.bio().call()
      const totalDonations = await instance.methods.totalDonations().call()
      const imageURL = await instance.methods.imageURL().call()
      const url = await instance.methods.url().call()

      const exchangeRate = await cc.price('ETH', ['USD'])
      setExchangeRate(exchangeRate.USD)
      const eth = web3.utils.fromWei(totalDonations, 'ether')
      const dollarDonationAmount = exchangeRate.USD * eth

      setTotalDonations(dollarDonationAmount.toFixed(2))
      setFundname(name)
      setBio(bio)
      setImageURL(imageURL)
      setURL(url)

      const userDonations = await instance.methods.myDonations().call({ from: accounts[0]})
      console.log(userDonations)
      setUserDonations(userDonations)

      const isUser = accounts[0]
      const isOwner = await instance.methods.owner().call()
      if (isOwner === accounts[[0]]) {
        setIsOwner(true)
      }
    }
    catch(error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  window.ethereum.on('accountsChanged', function (accounts) {
    window.location.reload()
  })

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitFunds = async () => {
    const fundraisercontract = contract
    const conversionRate = 18460;
    const ethRate = exchangeRate
    const ethTotal = donationAmount / ethRate
    const donation = web3.utils.toWei(ethTotal.toString())

    await contract.methods.donate(conversionRate).send({
      from: accounts[0],
      value: donation,
      gas: 650000
    })
    setOpen(false);
  }

  const showReceipt = (amount, date) => {

  }

  const renderDonationsList = () => {
    var donations = userDonations
    if (donations === null) {return null}

    const totalDonations = donations.values.length
    let donationList = []
    var i
    for (i = 0; i < totalDonations; i++) {
      const ethAmount = web3.utils.fromWei(donations.values[i])
      const userDonation = exchangeRate * ethAmount
      const donationDate = donations.dates[i]
      donationList.push({ donationAmount: userDonation.toFixed(2), date: donationDate})
    }

    return donationList.map((donation) => {
      return (
        <div className="donation-list">
          <p>${donation.donationAmount}</p>

          <Button variant="contained" color="primary">
            <Link className="donation-receipt-link" to={{ pathname: '/receipts', state: { fund: fundName, donation: donation.donationAmount, date: donation.date} }}>
              Request Receipt
            </Link>
          </Button>
        </div>
      )
    })
  }

  const withdrawalFunds = async () => {
    await contract.methods.withdraw().send({
      from: accounts[0],
    })

    alert('Funds Withdrawn!')
  }

  return (
    <div className="fundraiser-card-container">
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">
      Donate to {fundName}
    </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <img src={imageURL} width='200px' height='200px' />
          <p>{bio}</p>

          <div className="donation-input-container">
            <FormControl className={classes.formControl}>
              $
              <Input
                id="component-simple"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="0.00"
               />
            </FormControl>

            <p>Eth: {ethAmount}</p>
          </div>

          <Button onClick={submitFunds} variant="contained" color="primary">
            Donate
          </Button>

          <div>
            <h3>My donations</h3>
            {renderDonationsList()}
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        {isOwner &&
          <Button
            variant="contained"
            color="primary"
            onClick={withdrawalFunds}
          >
            Withdrawal
          </Button>
        }
      </DialogActions>
    </Dialog>

    <Card className={classes.card} onClick={handleOpen}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={imageURL}
          title="Fundraiser Image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {fundName}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            <p>{bio}</p>
            <p>Total Donations: ${totalDonations}</p>
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          onClick={handleOpen}
          variant="contained"
          className={classes.button}>
          View More
        </Button>
      </CardActions>
    </Card>
    </div>
  )
}

export default FundraiserCard;
