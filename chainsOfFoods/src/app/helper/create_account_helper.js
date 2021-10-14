const { cryptography, passphrase } = require( '@liskhq/lisk-client');
class NewAccount{

    async newCredentials(){        
        const pass = passphrase.Mnemonic.generateMnemonic();
        const keys = cryptography.getPrivateAndPublicKeyFromPassphrase(pass);
        const credentials = {
            address: cryptography.getBase32AddressFromPassphrase(pass),
            binaryAddress: cryptography.getAddressFromPassphrase(pass).toString("hex"),
            passphrase: pass,
            publicKey: keys.publicKey.toString("hex"),
            privateKey: keys.privateKey.toString("hex")
        };
        return credentials;
    };    
}

module.exports = NewAccount;