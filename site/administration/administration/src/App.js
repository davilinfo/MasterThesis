import logo from './logo.svg';
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
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Welcome to Restaurant wallet generation.
          </p>      

          <FormWallet onSubmit={handleSubmit}></FormWallet>          
        </header>              
                
      <div id='result'></div>
    </div>
  );
}

export default App;
