const ApiHelper = require('../api_helper');
const NewAccount = require('../create_account_helper');
const { cryptography, transactions } = require( '@liskhq/lisk-client');
const accounts = {
    "genesis": {
      "passphrase": "keen alarm cabbage inherit order tired ankle witness oyster beach purchase false"
    }
};

var accountFee = 0.002;
var totalAccount = 64;
let listCredentials = Array(0);
var count = 0;

class SpamTest{

    api = new ApiHelper('ws://localhost:8080/ws');

    async createAccount (nonce) {
        const account = new NewAccount();
        var newCredential = await account.newCredentials();
        console.log(newCredential);
        const client = await this.api.getClient();
        const address = cryptography.getAddressFromBase32Address(newCredential.address);

        var tx = await client.transaction.create({
            moduleID: 2,
            assetID: 0,
            fee: BigInt(transactions.convertLSKToBeddows(accountFee.toString())),
            nonce: BigInt(nonce),
            asset: {
                amount: BigInt(115000000),
                recipientAddress: address,
                data: 'ok',
            },
        }, accounts.genesis.passphrase);

        console.log(await client.transaction.send(tx));

        return newCredential;
    }    

    async preResult () {        
        while (count < totalAccount) {
            const accountNonce = await this.api.getAccountNonce(cryptography.getAddressFromPassphrase(accounts.genesis.passphrase));
            console.log('account nonce:'.concat(accountNonce.toString()));        
            const nonce = parseInt(accountNonce.toString()) + count;
            console.log('transaction nonce:'.concat(nonce.toString()));
            var credential = {};
            credential = await this.createAccount(nonce);
            listCredentials.push(credential);
            accountFee = accountFee + 0.001;
            accountFee = parseFloat(accountFee.toPrecision(3));
            console.log(accountFee);
            count++;
        }
        console.log("concluded accounts preparation");
        console.log("preparing to spam transactions");

        var objTimeout = setTimeout(async () => {
            await this.waitToExecuteTransactions();
            }, 30000);

        objTimeout.ref();
    }

    async waitToExecuteTransactions () {
        var countTransactions = 0;
        var countAccounts = 1;
        console.log("accounts: ".concat(listCredentials.length.toString()));
        
        while (listCredentials.length-1 >= 0){
            var transactionFee = 0.01;
            var actualCredential = listCredentials.pop();
            console.log(actualCredential);
            console.log("executed accounts:".concat(countAccounts.toString()));

            var food1 = {name: "Black Pasta", foodType: 1, quantity: 1, price:0.1, observation: ""};    
            var orderRequest = { items:[food1], 
            username: "davi", deliveryAddress: "Avenue Sete de Setembro, 2002, Appartament 1401, cep 40080-008", phone: "71997035287"};
            var restaurant = {publicKey: "248e8cbd593f375d38b1b19d670116cbb13a5be7c107a0c6e164e57de7d0efb4",
            address:"lsk7zk83qbjnn6abdnz3v2gkf2xyeby4fpk7kod9r"}

            while (countTransactions < 1){
                try{                    
                    var newTx = await this.api.createFoodAssetAndSign(orderRequest, actualCredential, restaurant);
                    const response = await this.api.sendTransaction(newTx);
                    console.log(response);
                    countTransactions++;
                    transactionFee = transactionFee + 0.001;
                    transactionFee = parseFloat(transactionFee.toPrecision(2));
                    console.log(transactionFee);
                }catch (e){
                    console.log(e);
                }
            }

            countTransactions = 0;
            countAccounts++;
        }
    }
}

var spam  = new SpamTest();

spam.preResult().then(function(response){
    //
}).catch(function(error){
    console.log(error);
});