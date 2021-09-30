import { BaseAsset } from 'lisk-sdk';
import { cryptography } from '@liskhq/lisk-client';

const ConfirmAssetId = 1090;

export class ConfirmAsset extends BaseAsset {
    name = "ConfirmAsset";
    id = ConfirmAssetId;
    schema = {
        $id: 'lisk/confirm/transaction',
        type: 'object',
        required: ["items"],
        properties: {
            items: {
                dataType: 'array',
                fieldNumber: 1
            },
        }
    }

    sidechainAddress () {
        const address = cryptography.getAddressFromBase32Address('lskfn3cm9jmph2cftqpzvevwxwyz864jh63yg784b');
        return address;
    }    

    static TYPE() {
        return ConfirmAssetId;
    }          

    validate({asset}){                                                        

        if (!asset.items){
            throw new Error(
                'Restaurant menu should include food and/or beverages. Please include at least some item: "asset.items"');            
        }

        for (var index=0; index < asset.items.length; index ++){

            if (!asset.items[index].transactionId || typeof asset.items[index].transactionId !== 'string'){
                throw  new Error(
                        'Invalid "transactionId" defined on transaction "asset.items[index].transactionId . '
                    );                
            }                                
        }                
    }

    async apply({ asset, stateStore, transaction }) {  
        const senderAddress = transaction.senderAddress;
        const senderAccount = await stateStore.account.get(senderAddress);

        const restaurantAddress = asset.recipientAddress;
        const restaurantAccount = await stateStore.account.get(restaurantAddress);

        if (senderAddress.toString() != restaurantAddress.toString()){            
            throw new Error(
                'Invalid "sender" "recipient", should be the same. sender: '.concat(senderAddress.toString()).concat(' recipient:').concat(restaurantAddress.toString()));
        }
                
        const sidechainAddress = this.sidechainAddress();
        const sidechainOwnerAccount = await stateStore.account.get(sidechainAddress);                
        
        await stateStore.account.set(senderAddress, senderAccount);        
        await stateStore.account.set(restaurantAddress, restaurantAccount);                
        await stateStore.account.set(this.sidechainAddress(), sidechainOwnerAccount); 
    }    
}

module.exports = ConfirmAsset;