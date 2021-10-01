import { BaseAsset } from 'lisk-sdk';
import { cryptography } from '@liskhq/lisk-client';

const FoodAssetId = 1040;

class FoodAsset extends BaseAsset {
    name = 'FoodAsset';
    id = FoodAssetId;
    schema = {
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
    } 

    sidechainAddress () {
        const address = cryptography.getAddressFromBase32Address('lskfn3cm9jmph2cftqpzvevwxwyz864jh63yg784b');
        return address;
    }    

    static TYPE() {
        return FoodAssetId;
    }      
    
    validate({asset}){                                                    

        for (var index=0; index < asset.items.length; index ++){
            if (!asset.items[index].name || typeof asset.items[index].name !== 'string' || asset.items[index].name.length > 200){            
                throw new Error(
                        'Invalid "asset.items[index].name" defined on transaction:A string value no longer than 200 characters. index: '.concat(index.toString()).concat(' ').concat(asset.items[index].name));
            }

            if (!asset.items[index].foodType || asset.items[index].foodType <= 0){
                throw new Error(
                        'Invalid "asset.items[index].foodType" defined on transaction: A value bigger than 0. index: '.concat(index.toString()).concat(' ').concat(asset.items[index].foodType));
            }

            if (!asset.items[index].quantity || asset.items[index].quantity < 0){
                throw new Error(
                        'Invalid "asset.items[index].quantity" defined on transaction: A value bigger than 0. index: '.concat(index.toString()).concat(' ').concat(asset.items[index].quantity));
            }

            if (!asset.items[index].price || asset.items[index].price < 0){
                throw new Error(
                        'Invalid "asset.items[index].price" defined on transaction: A value bigger than 0. index: '.concat(index.toString()).concat(' ').concat(asset.items[index].price));
            }
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
        const restaurantPaymentSubSidechainFee = asset.price - (asset.price/BigInt(100));

        await reducerHandler.invoke("token:credit", {
            address: restaurantAddress,
            amount: restaurantPaymentSubSidechainFee,
        });

        await stateStore.account.set(restaurantAddress, restaurantAccount);

        const sidechainAccount = await stateStore.account.get(this.sidechainAddress());        
        await reducerHandler.invoke("token:credit", {
            address: this.sidechainAddress(),
            amount: (asset.price/BigInt(100)),
        });
        
        await stateStore.account.set(this.sidechainAddress(), sidechainAccount);
                                
    }
    
}

module.exports = FoodAsset;