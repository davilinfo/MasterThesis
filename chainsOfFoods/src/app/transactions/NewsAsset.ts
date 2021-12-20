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
                dataType: 'string',
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

        var items = JSON.parse(asset.items);
        for (var index=0; index < items.length; index ++){

            if (!items[index].title || typeof items[index].title !== 'string' || items[index].title.length > 50){
                throw  new Error(
                        'Invalid "name" defined on transaction "asset.items[index].name . Should be included a string value no longer than 50 characters"'
                    );                
            }
    
            if (!items[index].description || typeof items[index].description !== 'string' || items[index].description.length > 160){
                throw new Error(
                        'Invalid "description" defined on transaction "asset.items[index].description. Should be included a string value no longer than 160 characters"'
                );
            }
    
            if (!items[index].text || items[index].text.length > 2000 ){
                throw new Error(
                        'Invalid "text" defined on transaction "asset.items[index].text" . Should be included a string value no longer than 2000 characters'
                    );                
            }                      
        }                
    }

    async apply({ stateStore, reducerHandler, transaction }) {  
        const senderAddress = transaction.senderAddress;
        const senderAccount = await stateStore.account.get(senderAddress);               
        
        await stateStore.account.set(senderAddress, senderAccount);
        await reducerHandler.invoke("token:debit", {
            address: senderAddress,
            amount: NewsAsset.FEE()
        });
        
        const sidechainOwnerAccount = await stateStore.account.get(this.sidechainAddress());                
        
        await stateStore.account.set(this.sidechainAddress(), sidechainOwnerAccount);
        await reducerHandler.invoke("token:credit", {
            address: this.sidechainAddress(),
            amount: NewsAsset.FEE()
        });        
    }    
}

module.exports = NewsAsset;