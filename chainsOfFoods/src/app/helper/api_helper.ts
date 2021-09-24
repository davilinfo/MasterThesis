const { apiClient, codec } = require( '@liskhq/lisk-client');

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

    async getAccount (address){
        const client = await this.getClient();
        const schema = await client.invoke('app:getSchema');
        const account = await client.invoke('app:getAccount', {
            address,
        });
                
        return codec.codec.decodeJSON(schema.account, Buffer.from(account, 'hex'));
    };

    async getAccountNonce (address) {
        var account = await this.getAccount(address);        
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

    async postTransaction(transaction){
        const client = await this.getClient();        
        const result = await client.invoke('app:postTransaction', {transaction: transaction});

        return result;
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
    var client = new ApiHelper('ws://204.48.25.12:8080/ws');

    client.getTransactionsFromPool().then(function(data){
        console.log(data);
    });

    client.getAccount("382d9ce8a767e2c711d021c6ddec5c6ea946c46a").then(function(data){
        console.log(data);
    });

    client.getAccountNonce("382d9ce8a767e2c711d021c6ddec5c6ea946c46a").then(function(data){
        console.log(data);
    });

    client.getBlockByHeight(14609043).then(function(data){
        console.log(data);
    });

    client.setNewBlockEventSubscriber();

    client.setNewTransactionEventSubscriber();
}

initiateTest();

module.exports = ApiHelper;