const { apiClient, codec, cryptography, transactions } = require( '@liskhq/lisk-client');
const schema = {
    $id: 'lisk/food/transaction',
    type: 'object',
    required: ["name", "description", "foodType", "price", "quantity", "restaurantData", "restaurantNonce"],
    properties: {
        name: {
            dataType: 'string',
            fieldNumber: 1
        },
        description: {
            dataType: 'string',
            fieldNumber: 2
        },
        foodType: {
            dataType: 'uint32',
            fieldNumber: 3
        },
        price:{
            dataType: 'uint64',
            fieldNumber: 4
        },            
        quantity: {
            dataType: 'uint32',
            fieldNumber: 5
        },
        restaurantData: {
            dataType: 'string',
            fieldNumber: 6
        },
        restaurantNonce: {
            dataType: 'string',
            fieldNumber: 7
        },
        observation: {
            dataType: 'string',
            fieldNumber: 8
        },
        recipientAddress: {
            dataType: "bytes",
            fieldNumber: 9
        }	  
    }
};

var menuSchema = {
    $id: 'lisk/menu/transaction',
    type: 'object',
    required: ["items"],
    properties: {
        items: {
            dataType: 'array',
            fieldNumber: 1
        },
    }
}

var profileSchema = {
    $id: 'lisk/profile/transaction',
    type: 'object',
    required: ["name", "clientData", "clientNonce"],
    properties: {
        name: {
            dataType: 'string',
            fieldNumber: 1
        },            
        clientData: {
            dataType: 'string',
            fieldNumber: 2
        },
        clientNonce: {
            dataType: 'string',
            fieldNumber: 3
        },	    
        recipientAddress: {
            dataType: "bytes",
            fieldNumber: 4
        }	  
    }
};
const networkIdentifier = "68bc1b08c5ee6218d58df4909116e35a4dda0bf723f018b6c315dba9851ea4de";

class ApiHelper{
             
    RPC_ENDPOINT;
    constructor (RPC_ENDPOINT){
        this.RPC_ENDPOINT = RPC_ENDPOINT;
    }

    static clientCache;
    async getClient () {
        if (!ApiHelper.clientCache) {            
            ApiHelper.clientCache = await apiClient.createWSClient(this.RPC_ENDPOINT);
        }        
        
        return ApiHelper.clientCache;
    };

    async getAccountFromAddress (address){
        const client = await this.getClient();
        const schema = await client.invoke('app:getSchema');
        const account = await client.invoke('app:getAccount', {
            address,
        });
                
        return codec.codec.decodeJSON(schema.account, Buffer.from(account, 'hex'));
    };

    async getAccountFromHexAddres(){
        const client = await this.getClient();             
                
        return await client.account.get(cryptography.getAddressFromBase32Address('lskfn3cm9jmph2cftqpzvevwxwyz864jh63yg784b'));
    }

    async getAccountNonce (address) {
        var account = await this.getAccountFromAddress(address);        
        const sequence = account.sequence;
        return Number(sequence.nonce);
    };

    async getBlockByHeight(height){
        const client = await this.getClient();
        const schema = await client.invoke('app:getSchema');
        const block = await client.invoke('app:getBlockByHeight', {height: height});
                
        return codec.codec.decodeJSON(schema.block, Buffer.from(block, 'hex'));
    }

    async getBlockById(id){
        const client = await this.getClient();
        const schema = await client.invoke('app:getSchema');
        const block = await client.invoke('app:getBlockByID', {id: id});
                
        return codec.codec.decodeJSON(schema.block, Buffer.from(block, 'hex'));
    }

    async getConnectedPeers(){
        const client = await this.getClient();        
        const nodeInfo = await client.invoke('app:getConnectedPeers', {});

        return nodeInfo;
    }    
    
    async getCustomTransactionByid(transactionId){        
        const client = await this.getClient();        
        
        return await client.transaction.get(Buffer.from(transactionId, 'hex'));
    }

    async getDisconnectedPeers(){
        const client = await this.getClient();        
        const nodeInfo = await client.invoke('app:getDisconnectedPeers', {});

        return nodeInfo;
    }

    async getGenericTransactionByid(transactionId){
        const client = await this.getClient();
        const schema = await client.invoke('app:getSchema');
        const transaction = await client.invoke('app:getTransactionByID', {id: transactionId});

        return codec.codec.decodeJSON(schema.transaction, Buffer.from(transaction, 'hex'));
    }    

    async getNodeInfo(){
        const client = await this.getClient();        
        const nodeInfo = await client.invoke('app:getNodeInfo', {});

        return nodeInfo;
    } 

    async getTransactionsFromPool(){
        const client = await this.getClient();
        const schema = await client.invoke('app:getSchema');
        const transactions = await client.invoke('app:getTransactionsFromPool');
        var transactionsDecoded;

        transactions.forEach(transaction => {
            
            var transactionDecoded = codec.codec.decodeJSON(schema.transaction, Buffer.from(transaction, 'hex'));
            transactionsDecoded.push(transactionDecoded);
            console.log(transactionDecoded);
        })

        return transactionsDecoded;
    }               

    async sendTransaction(transaction){
        const client = await this.getClient();        
        const result = await client.transaction.send(transaction);

        return result;
    }

    async createFoodAssetAndSign(orderRequest, credential, restaurantPublicKey, restaurantAddress){
        /*incluir validação de tipo de pedido através de consulta à menu asset (por definir)*/
        var recipientAddress = cryptography.getAddressFromBase32Address(restaurantAddress);

        const sender = cryptography.getAddressAndPublicKeyFromPassphrase(credential.passphrase);
        
        var accountNonce = await this.getAccountNonce(sender.address);        

        var restaurantData = cryptography.encryptMessageWithPassphrase(
            orderRequest.name.concat(' ***Field*** ')
            .concat(orderRequest.deliveryAddress)
            .concat(' ***Field*** ')
            .concat(orderRequest.phone)
            .concat(' ***Field*** ')
            .concat(orderRequest.username),
            credential.passphrase,
            restaurantPublicKey);
        
        const tx = await transactions.signTransaction(
            schema,
            {
                moduleID: 2000,
                assetID: 1040,
                nonce: BigInt(accountNonce),
                fee: BigInt(1000000),
                senderPublicKey: sender.publicKey,
                asset: {
                    name: orderRequest.name,
                    description: orderRequest.description,
                    foodType: orderRequest.foodType,
                    price: BigInt(transactions.convertLSKToBeddows(orderRequest.price.toString())),
                    observation: orderRequest.observation,
                    quantity: orderRequest.quantity,
                    restaurantData: restaurantData.encryptedMessage,
                    restaurantNonce: restaurantData.nonce,
                    recipientAddress: recipientAddress
                },
            },
            Buffer.from(networkIdentifier, "hex"),
            credential.passphrase);
    
        return tx;
    }

    async createMenuAssetAndSign(menu, credential){
        const sender = cryptography.getAddressAndPublicKeyFromPassphrase(credential.passphrase);

        var accountNonce = await this.getAccountNonce(sender.address);                
        
        const tx = await transactions.signTransaction(
            menuSchema,
            {
                moduleID: 2000,
                assetID: 1020,
                nonce: BigInt(accountNonce),
                fee: BigInt(0),
                senderPublicKey: sender.publicKey,
                asset: {
                    items: menu,
                    recipientAddress: sender.address
                },
            },
            Buffer.from(networkIdentifier, "hex"),
            credential.passphrase);
    
        return tx;
    }

    async createProfileAssetAndSign(userProfile, credential){
        const sender = cryptography.getAddressAndPublicKeyFromPassphrase(credential.passphrase);

        var accountNonce = await this.getAccountNonce(sender.address);
        
        var clientData = cryptography.encryptMessageWithPassphrase(
            userProfile.name.concat(' ***Field*** ')        
            .concat(userProfile.deliveryAddress)
            .concat(' ***Field*** ')        
            .concat(userProfile.phone),            
            credential.passphrase,
            sender.publicKey);
        
        const tx = await transactions.signTransaction(
            profileSchema,
            {
                moduleID: 2000,
                assetID: 1020,
                nonce: BigInt(accountNonce),
                fee: BigInt(1000000),
                senderPublicKey: sender.publicKey,
                asset: {                   
                    name: userProfile.name,
                    clientData: clientData.encryptedMessage,
                    clientNonce: clientData.nonce,
                    recipientAddress: sender.address
                },
            },
            Buffer.from(networkIdentifier, "hex"),
            credential.passphrase);
    
        return tx;
    }

    async setNewBlockEventSubscriber(){      
        const client = await this.getClient();      
        client.subscribe('app:block:new', async ( block ) => {
            const schema = await client.invoke('app:getSchema');
            var blockDecoded = codec.codec.decodeJSON(schema.block, Buffer.from(block.block, 'hex'))
            console.log(blockDecoded);
        });        
    }    

    async setNewTransactionEventSubscriber(){      
        const client = await this.getClient();      
        client.subscribe('app:transaction:new', async ( transaction ) => {
            const schema = await client.invoke('app:getSchema');
            var transactionDecoded = codec.codec.decodeJSON(schema.transaction, Buffer.from(transaction.transaction, 'hex'));
            console.log(transactionDecoded);
        });        
    }
}

function initiateTest(){
    var client = new ApiHelper('ws://localhost:8080/ws');

    client.getTransactionsFromPool().then(function(data){
        console.log(data);
    });
    
    client.getAccountFromAddress("ac6df241082d630bb60b834f091d210d0a529343").then(function(data){
        console.log(data);
    });

    client.getAccountNonce("ac6df241082d630bb60b834f091d210d0a529343").then(function(data){
        console.log(data);
    });

    client.getAccountFromHexAddres().then(function(data){
        console.log(data);
    });

    client.getBlockByHeight(50).then(function(data){
        console.log(data);
    });
    
    var credential = {passphrase: "rabbit logic scrap relief leg cheap region latin coffee walnut drum quality"};

    var profileRequest = { username: "user1", name: "User test", deliveryAddress: "Delivery address", phone: "Phone number" };

    client.createProfileAssetAndSign(profileRequest, credential).then(function(response){

        console.log("profile transaction created", response);

        client.sendTransaction(response).then(function(tx){
            console.log("profile transaction sent", tx);
        }).catch(function(e){
            console.log("Error sending profile transaction", e);
        });        
    }).catch(function(e){
        console.log("Error creating profile transaction", e);
    });

    /*var orderRequest = { username: "user1", name: "Black Pasta", deliveryAddress: "Delivery address", phone: "Phone number"
        , description: "delicious black pasta", foodType: 1, quantity: 1, price: 5};
    
    var restaurant = {publicKey: "458082e559d62d0e498b83828220144fdfcd481bdb8abdfb7a8773ff79c538be",
        address:"lskfn3cm9jmph2cftqpzvevwxwyz864jh63yg784b"}
    client.createFoodAssetAndSign(orderRequest, credential, restaurant.publicKey, restaurant.address).then(function(response){
        console.log("transaction created", response);

        client.sendTransaction(response).then(function(tx){
            console.log("food transaction sent", tx);
        }).catch(function(e){
            console.log("Error sending food transaction", e);
        });        
    }).catch(function(e){
        console.log("Error creating food transaction", e);
    });*/

    client.setNewBlockEventSubscriber();

    client.setNewTransactionEventSubscriber();
}

initiateTest();

module.exports = ApiHelper;