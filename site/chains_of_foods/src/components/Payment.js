import React, {useContext,useState} from 'react';
import { BasketStateContext } from '../context/basket';
import FormOrder from './FormOrder';

const ApiHelper = require('../service/api_helper');
const Config = require('../service/config');

const Payment = (props) => {
    const [transaction, setTransaction] = useState('');
    const { items = [] } = useContext(BasketStateContext);

    const totalItems = items.length;
    let totalPrice = 0;    

    async function handleSubmit(data){        
        var config = new Config.default();      
        var api = new ApiHelper.default(config.nodeWsAddress);
        
        if (window.localStorage.length === 0){
            alert("Empty basket. Please select a meal first");   
            return;         
        }

        console.log("initiating customer meal request");                
        
        var meals = [];
        items.map((item)=>{
            let meal = { 
                name: item.food.name, 
                foodType: item.food.type, 
                quantity: item.quantity, 
                price: item.food.price,
                observation: data.observation || ""
            };
            meals.push(meal);
        });
               
        var orderRequest = { items: meals, 
            username: data.username, deliveryAddress: data.deliveryaddress, phone: data.phone};
        
        var credential = {passphrase: data.passphrase};

        var restaurant = {publicKey: config.restaurantPublicKey,
            address: config.restaurantAddress}

        console.log("order", orderRequest);        
        console.log("restaurant", restaurant);

        await api.createFoodAssetAndSign(orderRequest, credential, restaurant).then(function(response){
            console.log("transaction created", response);
                
            api.sendTransaction(response).then(function(tx){
                console.log("food transaction sent", tx);
                                
                setTransaction("Transaction: ".concat(tx.transactionId));
                
                window.document.forms[0].querySelectorAll("input").forEach(element => {
                   element.value = ""; 
                });
                window.document.forms[0].querySelectorAll("textarea").forEach(element => {
                    element.value = ""; 
                 });

                 alert("Transaction sent to the blockchain: ".concat(tx.transactionId));
                 window.localStorage.clear();
                 window.document.location="/";
            }).catch(function(e){
                console.log("Error sending food transaction", e);
                window.document.querySelectorAll(".order-transaction-id").forEach(element => {
                    element.textContent = "Transaction error: ".concat(e);
                 });
            });
                   
        }).catch(function(e){
            console.log("Error in food transaction", e);
            window.document.querySelectorAll(".order-transaction-id").forEach(element => {
                element.textContent = "Transaction error: ".concat(e);
             });            
        });
    }

    return (
        <div className="payment-page">
            <div className="order-container">
                <div className="order-address">
                    <FormOrder onSubmit={handleSubmit}></FormOrder>
                </div>
                <div className="order-resume">
                    <h3>
                        Order resume:<span>{` ${totalItems} selections`}</span>
                    </h3>
                    <ul className="order-items">
                        {items.map((item)=>{ 
                            totalPrice = totalPrice + item.quantity * item.food.price;                            
                            return (
                                <li className="basket-item" key={item.food.type}>
                                    <img className="basket-popup-img" src={item.food.img}alt="Food"></img>
                                    <div className="basket-popup-food">
                                        <span className="basket-popup-span">{item.food.name}</span>
                                        <span className="basket-popup-span"> Price ${item.food.price}</span>
                                    </div>
                                    <div className="basket-popup-food-numbers">
                                        <span className="basket-popup-span"> Items: {`${item.quantity}`}</span>
                                        <span className="basket-popup-span"> Sub Total: {item.quantity * item.food.price}</span>
                                    </div>                                    
                                </li>
                            );
                        })}
                    </ul>
                    <ul className="total">
                        <li>
                            <h3>
                                Total $ {totalPrice}
                            </h3>                            
                        </li>
                    </ul>
                </div>
            </div>
            <div className="order-result">
                <span className="order-transaction-id">{transaction}</span>
            </div>
        </div>
    );
}

export default Payment;