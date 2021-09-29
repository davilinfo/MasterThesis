import { BaseAsset } from 'lisk-sdk';
import { cryptography } from '@liskhq/lisk-client';

const FoodAssetId = 1040;

class FoodAsset extends BaseAsset {
    name = 'FoodAsset';
    id = FoodAssetId;
    schema = {
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
    } 

    sidechainAddress () {
        const address = cryptography.getAddressFromBase32Address('lskfn3cm9jmph2cftqpzvevwxwyz864jh63yg784b');
        return address;
    }    

    static TYPE() {
        return FoodAssetId;
    }      
    
    validate({asset}){                                                    

        if (!asset.name || typeof asset.name !== 'string' || asset.name.length > 200){            
            throw new Error(
                    'Invalid "asset.name" defined on transaction:A string value no longer than 200 characters');            
        }

        if (!asset.description || typeof asset.description !== 'string' || asset.description.length > 1500){
            throw new Error(
                    'Invalid "asset.description" defined on transaction: A string value no longer than 1500 characters');
        }

        if (!asset.foodType || asset.foodType <= 0){
            throw new Error(
                    'Invalid "asset.foodType" defined on transaction: A value bigger than 0');
        }        
        
        if (!asset.price || asset.price <= 0){
            throw new Error(
                    'Invalid "asset.price" defined on transaction: A value bigger than 0');
        }

        if (!asset.restaurantData || asset.restaurantData.length === 0){
            throw new Error(
                    'Invalid "restaurantData" defined on transaction:Not empty');
        }

        if (!asset.restaurantNonce || asset.restaurantNonce.length === 0){
            throw new Error(
                    'Invalid "restaurantNonce" defined on transaction: Not empty');
        }             
    }

    async apply({asset, stateStore, reducerHandler, transaction}){        
        
        // Get sender account details
        const senderAddress = transaction.senderAddress;
        const senderAccount = await stateStore.account.get(senderAddress);

        if (!senderAccount){           
            throw new Error(
                    'Invalid "sender", please verify your passpahrase and address');            
        }        

        await stateStore.account.set(senderAddress, senderAccount);

        await reducerHandler.invoke("token:debit", {
            address: senderAddress,
            amount: asset.price,
          });    

        const restaurantAddress = asset.recipientAddress;
        const restaurantAccount = await stateStore.account.get(asset.recipientAddress);
        const restaurantPaymentSubSidechainFee = asset.price - (asset.price/100);

        await reducerHandler.invoke("token:credit", {
            address: restaurantAddress,
            amount: restaurantPaymentSubSidechainFee,
        });

        await stateStore.account.set(restaurantAddress, restaurantAccount);

        const sidechainAccount = await stateStore.account.get(this.sidechainAddress());        
        await reducerHandler.invoke("token:credit", {
            address: this.sidechainAddress(),
            amount: (asset.price/100),
        });
        
        await stateStore.account.set(this.sidechainAddress(), sidechainAccount);
                                
    }
    
}

module.exports = FoodAsset;