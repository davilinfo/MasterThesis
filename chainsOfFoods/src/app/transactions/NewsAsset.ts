import { BaseAsset } from 'lisk-sdk';
import { cryptography } from '@liskhq/lisk-client';

const NewsAssetId = 1080;

export class NewsAsset extends BaseAsset {
    name = "NewsAsset";
    id = NewsAssetId;
    schema = {
        $id: 'lisk/news/transaction',
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
        return NewsAssetId;
    }

    static FEE () {
		return BigInt('100000000');
    };        

    validate({asset}){                                                        

        if (!asset.items){
            throw new Error(
                'Restaurant menu should include food and/or beverages. Please include at least some item: "asset.items"');            
        }

        for (var index=0; index < asset.items.length; index ++){

            if (!asset.items[index].title || typeof asset.items[index].title !== 'string' || asset.items[index].title > 50){
                throw  new Error(
                        'Invalid "name" defined on transaction "asset.items[index].name . Should be included a string value no longer than 50 characters"'
                    );                
            }
    
            if (!asset.items[index].description || typeof asset.items[index].description !== 'string' || asset.items[index].description.length > 160){
                throw new Error(
                        'Invalid "description" defined on transaction "asset.items[index].description. Should be included a string value no longer than 160 characters"'
                );
            }
    
            if (!asset.items[index].text || asset.items[index].text > 2000 ){
                throw new Error(
                        'Invalid "text" defined on transaction "asset.items[index].text" . Should be included a string value no longer than 2000 characters'
                    );                
            }                      
        }                
    }

    async apply({ asset, stateStore, reducerHandler, transaction }) {  
        const senderAddress = transaction.senderAddress;

        const restaurantAddress = asset.recipientAddress;
        const restaurantAccount = await stateStore.account.get(restaurantAddress);

        if (senderAddress.toString() != restaurantAddress.toString()){            
            throw new Error(
                'Invalid "sender" "recipient", should be the same. sender: '.concat(senderAddress.toString()).concat(' recipient:').concat(restaurantAddress.toString()));
        }
        
        await stateStore.account.set(restaurantAddress, restaurantAccount);
        await reducerHandler.invoke("token:debit", {
            address: restaurantAddress,
            amount: NewsAsset.FEE()
        });

        const sidechainAddress = this.sidechainAddress();
        const sidechainOwnerAccount = await stateStore.account.get(sidechainAddress);                
        
        await stateStore.account.set(sidechainAddress, sidechainOwnerAccount);
        await reducerHandler.invoke("token:credit", {
            address: sidechainAddress,
            amount: NewsAsset.FEE()
        });        
    }    
}

module.exports = NewsAsset;