const { apiClient, codec, cryptography, transactions } = require( '@liskhq/lisk-client');
const schema = {
    $id: 'lisk/food/transaction',
    type: 'object',
    required: ["items", "price", "restaurantData", "restaurantNonce", "recipientAddress"],
    properties: {            
        items: {
            dataType: 'string',
            fieldNumber: 1
        },
        price:{
            dataType: 'uint64',
            fieldNumber: 2
        },
        restaurantData: {
            dataType: 'string',
            fieldNumber: 3
        },
        restaurantNonce: {
            dataType: 'string',
            fieldNumber: 4
        },
        recipientAddress: {
            dataType: "bytes",
            fieldNumber: 5
        }	  
    }
};

var menuSchema = {
    $id: 'lisk/menu/transaction',
    type: 'object',
    required: ["items"],
    properties: {
        items: {
            dataType: 'string',
            fieldNumber: 1
        },
    }
}

var newsSchema = {
    $id: 'lisk/news/transaction',
    type: 'object',
    required: ["items"],
    properties: {
        items: {
            dataType: 'string',
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
const server = { host: "http://localhost:4000" };

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

    async getTransactions(){
        const client = await this.getClient();
        return await await client.invoke('app:getRegisteredActions');
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
        var transactionsDecoded = [];

        transactions.forEach(transaction => {
            
            var transactionDecoded = codec.codec.decodeJSON(schema.transaction, Buffer.from(transaction, 'hex'));
            transactionsDecoded.push(transactionDecoded);
            console.log(transactionDecoded);
        })

        return transactionsDecoded;
    }    
    
    async getTransactionsSchemas(){
        const client = await this.getClient();
        const schema = await client.invoke('app:getSchema');
        const result = await schema.transactionsAssets;

        return result;
    }

    async sendTransaction(transaction){
        const client = await this.getClient();        
        const result = await client.transaction.send(transaction);

        return result;
    }

    async getMenuTransaction(){
        var url = server.host.concat("/api/node/transactions?limit=50");

        var response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response;
    }

    async createFoodAssetAndSign(orderRequest, credential, restaurant){
        /*incluir validação de tipo de pedido através de consulta à menu asset (por definir)*/
        var recipientAddress = cryptography.getAddressFromBase32Address(restaurant.address);

        const sender = cryptography.getAddressAndPublicKeyFromPassphrase(credential.passphrase);
        
        var accountNonce = await this.getAccountNonce(sender.address);        

        var orderPrice = 0;
        
        var items = orderRequest.items;
        console.log("items :", typeof []);
        
        items.forEach(item =>{            
            orderPrice += (item.price * item.quantity);
        });        

        console.log("price", orderPrice);

        var restaurantData = cryptography.encryptMessageWithPassphrase(
            orderRequest.deliveryAddress
            .concat(' ***Field*** ')
            .concat(orderRequest.phone)
            .concat(' ***Field*** ')
            .concat(orderRequest.username),
            credential.passphrase,
            restaurant.publicKey);
        
        const tx = await transactions.signTransaction(
            schema,
            {
                moduleID: 2000,
                assetID: 1040,
                nonce: BigInt(accountNonce),
                fee: BigInt(0),
                senderPublicKey: sender.publicKey,
                asset: {
                    items: JSON.stringify(orderRequest.items),
                    price: BigInt(transactions.convertLSKToBeddows(orderPrice.toString())),                    
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
                assetID: 1060,
                nonce: BigInt(accountNonce),
                fee: BigInt(0),
                senderPublicKey: sender.publicKey,
                asset: {
                    items: JSON.stringify(menu),
                    recipientAddress: sender.address
                },
            },
            Buffer.from(networkIdentifier, "hex"),
            credential.passphrase);
    
        return tx;
    }

    async createNewsAssetAndSign(news, credential){
        const sender = cryptography.getAddressAndPublicKeyFromPassphrase(credential.passphrase);
        
        var accountNonce = await this.getAccountNonce(sender.address);                
        
        const tx = await transactions.signTransaction(
            newsSchema,
            {
                moduleID: 2000,
                assetID: 1080,
                nonce: BigInt(accountNonce),
                fee: BigInt(0),
                senderPublicKey: sender.publicKey,
                asset: {
                    items: JSON.stringify(news),
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
                fee: BigInt(0),
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

    client.getTransactions().then(function(data){
        console.log("getTransactions", data);
    });
    
    client.getAccountFromAddress("7028f454dc39d59368e040b1fa7b018d8d14f894").then(function(data){
        console.log(data);
    });

    client.getAccountNonce("ac6df241082d630bb60b834f091d210d0a529343").then(function(data){
        console.log(data);
    });

    client.getAccountFromHexAddres().then(function(data){
        console.log(data);
    });

    client.getBlockByHeight(200).then(function(data){
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
    
    var food1 = {name: "Black Pasta", foodType: 1, quantity: 1, price:0.1, observation: ""};
    var food2 = {name: "Black Pasta", foodType: 1, quantity: 1, price:0.1, observation: ""};
    var orderRequest = { items:[food1, food2], 
        username: "user1", deliveryAddress: "Delivery address", phone: "Phone number"};
    
    var credential2 = {passphrase: "safe secret dentist color file ball town joy dad tilt foot asthma"};

    var restaurant = {publicKey: "248e8cbd593f375d38b1b19d670116cbb13a5be7c107a0c6e164e57de7d0efb4",
        address:"lsk7zk83qbjnn6abdnz3v2gkf2xyeby4fpk7kod9r"}
    client.createFoodAssetAndSign(orderRequest, credential2, restaurant).then(function(response){
        console.log("transaction created", response);

        client.sendTransaction(response).then(function(tx){
            console.log("food transaction sent", tx);
        }).catch(function(e){
            console.log("Error sending food transaction", e);
        });        
    }).catch(function(e){
        console.log("Error creating food transaction", e);
    });
                    
    var menu = [{
        "img": "images/ostras-in-natura.jpg",
        "name": "oysters entrance",
        "type": 1,
        "price": 50,
        "category": 1,
        "discount": 1,
        "description": "12 fresh oysters served in a plate"
    },
    {
        "img": "images/moulmari.jpg",
        "name": "cooked moules entrance",
        "type": 2,
        "price": 40,
        "category": 1,
        "discount": 1,
        "description": "Several cooked fresh moules à la creme"
    },
    {
        "img": "images/vanilla_icecream_strawberry_syrup.jpg",
        "name": "vanilla ice cream dessert",
        "type": 3,
        "price": 10,
        "category": 3,
        "discount": 1,
        "description": "vanilla ice cream with strawberry syrup"
    },
    {
        "img": "images/ribs_on_the_barbie.jpg",
        "name": "Ribs on the barbecue + vanilla ice cream dessert",
        "type": 4,
        "price": 50,
        "category": 2,
        "discount": 0.3,
        "description": "10 baked ribs on the barbecue sauce + vanilla ice cream with strawberry syrup"
    },
    {
        "img": "images/oysters_gratines_aux_fromages.jpg",
        "name": "oysters with baked cheese entrance",
        "type": 5,
        "price": 70,
        "category": 1,
        "discount": 1,
        "description": "12 fresh oysters with baked cheeses served in a plate"
    },
    {
        "img": "images/baked-oysters-plus-ribs.jpg",
        "name": "oysters with baked cheese entrance + ribs on the barbecue + vanilla ice cream dessert",
        "type": 6,
        "price": 120,
        "category": 2,
        "discount": 0.3,
        "description": "12 fresh oysters with baked cheeses served in a plate + 10 baked ribs on the barbecue sauce + vanilla ice cream with strawberry syrup"
    },
    {
        "img": "images/heineken_can.jpg",
        "name": "Heineken beer can",
        "type": 7,
        "price": 3,
        "category": 4,
        "discount": 1,
        "description": "Heineken beer can"
    },
    {
        "img": "images/bottle_water.jpg",
        "name": "Bottle of water",
        "type": 8,
        "price": 2,
        "category": 4,
        "discount": 1,
        "description": "Bottle of water"
    }];

    var restaurantCredential = {passphrase: "scorpion abstract adapt fish goddess cage seed must benefit same witness property"};
    client.createMenuAssetAndSign(menu, restaurantCredential).then(function(response){
        console.log("transaction created", response);

        client.sendTransaction(response).then(function(tx){
            console.log("menu transaction sent", tx);
        }).catch(function(e){
            console.log("Error sending menu transaction", e);
        });
    }).catch(function(e){
        console.log("Error creating menu transaction", e);
    });    

    var delegateCredential = {passphrase: "vault issue acid early emotion dress sword inform scorpion journey bracket flip"};
    var news = [{
        "title": "News from restaurant sidechain",
        "description": "Restaurant sidechain offers only 1% fees for each food transaction",
        "text": "The brand new restaurant sidechain offers a new solution for restaurants based in blockchain technology"
    }];

    client.createNewsAssetAndSign(news, delegateCredential).then(function(response){
        console.log("transaction created", response);

        client.sendTransaction(response).then(function(tx){
            console.log("news transaction sent", tx);
        }).catch(function(e){
            console.log("Error sending news transaction", e);
        });
    }).catch(function(e){
        console.log("Error creating news transaction", e);
    });      

    client.setNewBlockEventSubscriber();

    client.setNewTransactionEventSubscriber();
}

//initiateTest();

module.exports = ApiHelper;