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

        var items = JSON.parse(asset.items);

        for (var index=0; index < items.length; index ++){

            if (!items[index].name || typeof items[index].name !== 'string' || items[index].name.length > 200){
                throw  new Error(
                        'Invalid "name" defined on transaction "asset.items[index].name . Should be included a string value no longer than 200 characters"'                        
                    );                
            }
    
            if (!items[index].description || typeof items[index].description !== 'string' || items[index].description.length > 2000){
                throw new Error(
                        'Invalid "description" defined on transaction "asset.items[index].description. Should be included a string value no longer than 2000 characters"'
                );
            }
    
            if (!items[index].price || items[index].price < 0 ){
                throw new Error(
                        'Invalid "price" defined on transaction "asset.items[index].price" . A value equal or bigger than 0'
                    );                
            }
    
            if (!items[index].discount || items[index].discount < 0 ){
                throw new Error(
                        'Invalid "asset.items[index].discount" defined on transaction . A value equal or bigger than 0'                    
                );
            }
    
            if (!items[index].type){
                throw new Error(
                        'Invalid "asset.items[index].type" defined on transaction . A number bigger than 0'
                );
            }

            if (!items[index].category){
                throw new Error(
                        'Invalid "asset.items[index].category" defined on transaction . A number bigger than 0'
                );
            }

            if (!items[index].img){
                throw new Error(
                        'Invalid "asset.items[index].img" defined on transaction . A string http address of the food image'                
                );
            }            
        }                
    }

    async apply({stateStore, reducerHandler, transaction }) {       
        const senderAddress = transaction.senderAddress;

        const restaurantAddress = senderAddress;
        const restaurantAccount = await stateStore.account.get(senderAddress);                      

        await stateStore.account.set(restaurantAddress, restaurantAccount);
        await reducerHandler.invoke("token:debit", {
            address: restaurantAddress,
            amount: MenuAsset.FEE()
        });
        
        const sidechainOwnerAccount = await stateStore.account.get(this.sidechainAddress());                
        
        await stateStore.account.set(this.sidechainAddress(), sidechainOwnerAccount);
        await reducerHandler.invoke("token:credit", {
            address: this.sidechainAddress(),
            amount: MenuAsset.FEE()
        });        
    }    
}

module.exports = MenuAsset;