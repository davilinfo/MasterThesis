const ApiHelper = require('../api_helper');

class MenuScript{    
    api = new ApiHelper('ws://localhost:8080/ws');

    async initiate(){   
        var client = this.api;     

        var menu = [{
            "img": "images/PestoItalian/herb_tuba.jpg",
            "name": "Herb Tuna entrance",
            "type": 1,
            "price": 17.89,
            "category": 1,
            "discount": 1,
            "description": "Thinly sliced herb encrusted ahi tuna topped with diced tomatoes, olives, capers, red onions and fennel. Perfect choice even for the first-time visitors!"
        },
        {
            "img": "images/PestoItalian/chocolate_and_pistacho.jpg",
            "name": "Chocolate and Pistacho",
            "type": 2,
            "price": 4.89,
            "category": 3,
            "discount": 1,
            "description": "At Pesto, we vary these wonderful nutty biscotti, while also dipping them in melted dark chocolate for an extra layer of flavor."
        },
        {
            "img": "images/PestoItalian/delicious-sicilian-cannoli-cannoli-exquisite-traditional-dessert-sicilian-cuisine-filled-ricotta-candied-143895374.jpg",
            "name": "Cannoli",
            "type": 3,
            "price": 6.89,
            "category": 3,
            "discount": 1,
            "description": "Trio tower of cannoli filled with smooth ricotta, sugar & cinnamon, with chocolate & raspberry sauces. Single cannoli is also available."
        },
        {
            "img": "images/PestoItalian/tiramisu-613039736-612x612.jpg",
            "name": "Tiramisu",
            "type": 4,
            "price": 6.89,
            "category": 3,
            "discount": 1,
            "description": "A Pesto’s favorite - classNameic Italian dessert made with lady fingers, Mascarpone cheese & espresso. Perfect for both kids and adults."
        },
        {
            "img": "images/PestoItalian/gelato_istockphoto-467157359-612x612.jpg",
            "name": "Gelato",
            "type": 5,
            "price": 4,
            "category": 3,
            "discount": 1,
            "description": "Our gelato"
        },
        {
            "img": "images/PestoItalian/ravioli-w-bolgnese.jpg",
            "name": "Ravioli",
            "type": 6,
            "price": 8,
            "category": 2,
            "discount": 0.3,
            "description": "Traditional ravioli"
        },                
        {
            "img": "images/PestoItalian/filetto_di_manzo_9a87cb047d2b8cf0895b74b402c5326f.jpg",
            "name": "Filetto di Manzo",
            "type": 7,
            "price": 26,
            "category": 2,
            "discount": 0.3,
            "description": "Filetto di manzo with wine and grilled potatoes"
        },
        {
            "img": "images/PestoItalian/osso_buco_16153_1474765828_0.jpg",
            "name": "Osso Buco",
            "type": 8,
            "price": 25.89,
            "category": 2,
            "discount": 0.3,
            "description": "Osso Buco is one of the Italian greats - slow cooked veal in a white wine tomato sauce. Meltingly tender, this is both hearty and luxurious."
        },        
        {
            "img": "images/PestoItalian/pappardelle_511948416afabb46ef35c6da9888e008.jpg",
            "name": "Pappardelle Mimmo",
            "type": 9,
            "price": 16.89,
            "category": 2,
            "discount": 0.3,
            "description": "This delicious dish tops long, wide pasta with scallops, lobster, asparagus, butter, sage and truffle oil to cater every palate."
        },
        {
            "img": "images/PestoItalian/aperol_spritz-689301542-612x612.jpg",
            "name": "Aperol Spritz",
            "type": 10,
            "price": 10.89,
            "category": 4,
            "discount": 1,
            "description": "The most popular drink in Venice: refreshing, easygoing &…happy! Perfect to be sipped as an “Aperitivo” just before dinner - delightful!"
        },
        {
            "img": "images/PestoItalian/negroni_955791476-612x612.jpg",
            "name": "Negroni",
            "type": 11,
            "price": 9.89,
            "category": 4,
            "discount": 1,
            "description": "Reward yourself with a moment of relaxation & pure pleasure while enjoying the full flavour & simplicity of a Negroni, an iconic Italian cocktail."
        },
        {
            "img": "images/PestoItalian/negroni_sbagliato.jpg",
            "name": "Negroni Sbagliato",
            "type": 12,
            "price": 11.89,
            "category": 4,
            "discount": 1,
            "description": "A cocktail for those who prefer more delicate flavours but nonetheless want a drink full of taste & personality."
        },
        {
            "img": "images/PestoItalian/heineken_can.jpg",
            "name": "Heineken beer can",
            "type": 13,
            "price": 3,
            "category": 4,
            "discount": 1,
            "description": "Heineken beer can"
        },
        {
            "img": "images/PestoItalian/bottle_water.jpg",
            "name": "Bottle of water",
            "type": 14,
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
    }
}

var menu = new MenuScript();

console.log('initiating menu script...');
menu.initiate().then(async function (response){
   console.log('ok');    
}).catch(function(error){
    console.log('Error', error);
}).finally(function(){
    console.log('finished');
});

