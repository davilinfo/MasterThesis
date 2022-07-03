import sidechain_logo from './images/admin.png';
import './App.css';
import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import FormWallet from './components/FormWallet';
import {passphrase, cryptography} from "@liskhq/lisk-client"; 

function App(props) {
  let[lpassphrase, setPassphrase] = useState('');
  let[lprivateKey, setPrivateKey] = useState('');
  let[lprublicKey, setPublicKey] = useState('');
  let[laddress, setAddress] = useState('');
  let[lbase32Address, setBase32Address] = useState('');
  
  async function handleSubmit(){    
    
    lpassphrase = passphrase.Mnemonic.generateMnemonic();  
    console.log(lpassphrase);  
    
    laddress = await cryptography.getAddressAndPublicKeyFromPassphrase(lpassphrase).address;      
    lbase32Address = await cryptography.getBase32AddressFromPassphrase(lpassphrase);
    lprivateKey = await cryptography.getPrivateAndPublicKeyFromPassphrase(lpassphrase).privateKey;
    lprublicKey = await cryptography.getPrivateAndPublicKeyFromPassphrase(lpassphrase).publicKey;
    setAddress(laddress);
    setBase32Address(lbase32Address);
    setPrivateKey(lprivateKey);
    setPublicKey(lprublicKey);
    setPassphrase(lpassphrase);    
    
    const generationResult = (
      <footer>
               
        <div className='text-align-left'>
          <span className='wallet-reserved-word'> Passphrase:</span> {lpassphrase}
        </div>
        <div className='text-align-left'>
        <span className='wallet-reserved-word'>Address:</span> {laddress}
        </div>
        <div className='text-align-left'>
          <span className='wallet-reserved-word'>Base 32 address:</span> {lbase32Address}
        </div>
        <div className='text-align-left'>
          <span className='wallet-reserved-word'>Public Key:</span> {lprublicKey}
        </div>    
        <div className='text-align-left important'>
          Save this information safely and do not share your passphrase with anyone else, it is private and belongs to you.
        </div>     
      </footer>
    );

    ReactDOM.render(generationResult, document.getElementById('result'));      
    
  }

  return (
    <div className="App">
      
        <header className="App-header">
          <img src={sidechain_logo} className='sidechain-logo' alt="sidechain logo" />
          <p>
            Welcome. This is the first step to join a restaurant into the Sidechain of Restaurants.
            At glance, the restaurant sidechain is commum blockchain composed with machines that run
             the same protocol to allow restaurants serve clients and clients pay restaurants utilizing
             the blockchain technology. This reduce payment fees for restaurants and clients, also in this
             sidechain any client sensitive information is protected with secure cryptography.
          </p>      

          <p>
            Now, how to join the sidechain of restaurants? The first step is to generate a restaurant digital wallet.
            The wallet allows restaurant connect into sidechain and also receive and transfer any cryptocurrency 
            from its client. Please, go and click on Generate button to generate safely your first wallet.
          </p>

          <FormWallet onSubmit={handleSubmit}></FormWallet>

          <p>
            Secondly, you need to connect to a sidechain node. For that follow the <span> </span>  
            <a className='App-link' href='https://sidechain.liskrestaurant.com'>Sidechain nodes page</a>
          </p>
          
          <p>
            Finally, to interact with the sidechain network download the library that allows a restaurant to
            utilize blockchain technology for generating a restaurant menu, create food transactions,
            create user profile, send news and more.
          </p>
        </header>              
                
      <div id='result'></div>
    </div>
  );
}

export default App;
