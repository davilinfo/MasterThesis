import { BaseAsset } from 'lisk-sdk';
import { cryptography } from '@liskhq/lisk-client';

const ProfileAssetId = 1020;

class ProfileAsset extends BaseAsset {
    name = 'ProfileAsset';
    id = ProfileAssetId;
    schema = {
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
    } 

    sidechainAddress () {
        const address = cryptography.getAddressFromBase32Address('lskfn3cm9jmph2cftqpzvevwxwyz864jh63yg784b');
        return address;
    }

    sidechainFee () {
        return BigInt('0');
    }

    static TYPE() {
        return ProfileAssetId;
    }      
    
    validate({asset}){                                             

        if (!asset.name || typeof asset.name !== 'string' || asset.name.length > 200){            
            throw new Error(
                    'Invalid "asset.name" defined on transaction:A string value no longer than 200 characters');            
        }        

        if (!asset.clientData || asset.clientData.length === 0){
            throw new Error(
                    'Invalid "clientData" defined on transaction:Not empty');
        }

        if (!asset.clientNonce || asset.clientNonce.length === 0){
            throw new Error(
                    'Invalid "clientNonce" defined on transaction: Not empty');
        }             
    }

    async apply({asset, stateStore, transaction}){
        
        // Get sender account details
        const senderAddress = transaction.senderAddress;
        const senderAccount = await stateStore.account.get(senderAddress);

        const recipientAddress = asset.recipientAddress;
        const recipientAccount = await stateStore.account.get(recipientAddress);        

        if (!senderAccount){           
            throw new Error(
                    'Invalid "sender", please verify your passpahrase and address');            
        }
        
        if (!recipientAccount){           
            throw new Error(
                    'Invalid "recipient", please verify your passpahrase and address');            
        }

        if (senderAddress != recipientAddress){            
            throw new Error(
                'Invalid "sender" "recipient", should be the same. sender: '.concat(senderAddress.toString()).concat(' recipient:').concat(recipientAddress.toString()));
        }
        
        const sidechainAccount = await stateStore.account.get(this.sidechainAddress());

        await stateStore.account.set(senderAddress, senderAccount);        
        await stateStore.account.set(recipientAddress, recipientAccount);                
        await stateStore.account.set(this.sidechainAddress(), sidechainAccount);                                
    }
    
}

module.exports = ProfileAsset;