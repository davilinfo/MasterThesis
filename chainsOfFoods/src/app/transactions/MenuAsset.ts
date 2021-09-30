import { BaseAsset } from 'lisk-sdk';
import { cryptography } from '@liskhq/lisk-client';

const MenuAssetId = 1060;

export class MenuAsset extends BaseAsset {
    name = "MenuAsset";
    id = MenuAssetId;
    schema = {
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

    sidechainAddress () {
        const address = cryptography.getAddressFromBase32Address('lskfn3cm9jmph2cftqpzvevwxwyz864jh63yg784b');
        return address;
    }    

    static TYPE() {
        return MenuAssetId;
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

            if (!asset.items[index].name || typeof asset.items[index].name !== 'string' || asset.items[index].length > 200){
                throw  new Error(
                        'Invalid "name" defined on transaction "asset.items[index].name . Should be included a string value no longer than 200 characters"'                        
                    );                
            }
    
            if (!asset.items[index].description || typeof asset.items[index].description !== 'string' || asset.items[index].description.length > 2000){
                throw new Error(
                        'Invalid "description" defined on transaction "asset.items[index].description. Should be included a string value no longer than 2000 characters"'
                );
            }
    
            if (!asset.items[index].price || asset.items[index].price < 0 ){
                throw new Error(
                        'Invalid "price" defined on transaction "asset.items[index].price" . A value equal or bigger than 0'
                    );                
            }
    
            if (!asset.items[index].discount || asset.items[index].discount < 0 ){
                throw new Error(
                        'Invalid "asset.items[index].discount" defined on transaction . A value equal or bigger than 0'                    
                );
            }
    
            if (!asset.items[index].type){
                throw new Error(
                        'Invalid "asset.items[index].type" defined on transaction . A number bigger than 0'
                );
            }

            if (!asset.items[index].category){
                throw new Error(
                        'Invalid "asset.items[index].category" defined on transaction . A number bigger than 0'
                );
            }

            if (!asset.items[index].img){
                throw new Error(
                        'Invalid "asset.items[index].img" defined on transaction . A string http address of the food image'                
                );
            }            
        }                
    }

    async apply({asset, stateStore, reducerHandler, transaction }) {       
        const senderAddress = transaction.senderAddress;

        const restaurantAddress = asset.recipientAddress;
        const restaurantAccount = await stateStore.account.get(asset.recipientAddress);        
        
        if (senderAddress.toString() != restaurantAddress.toString()){            
            throw new Error(
                'Invalid "sender" "recipient", should be the same. sender: '.concat(senderAddress.toString()).concat(' recipient:').concat(restaurantAddress.toString()));
        }

        await stateStore.account.set(restaurantAddress, restaurantAccount);
        await reducerHandler.invoke("token:debit", {
            address: restaurantAddress,
            amount: MenuAsset.FEE()
        });

        const sidechainAddress = this.sidechainAddress();
        const sidechainOwnerAccount = await stateStore.account.get(sidechainAddress);                
        
        await stateStore.account.set(sidechainAddress, sidechainOwnerAccount);
        await reducerHandler.invoke("token:credit", {
            address: sidechainAddress,
            amount: MenuAsset.FEE()
        });        
    }    
}

module.exports = MenuAsset;