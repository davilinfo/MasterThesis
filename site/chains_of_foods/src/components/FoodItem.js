import React, {useContext} from 'react';
import { insertBasket, BasketDispatchContext } from '../context/basket';

function FoodItem(props){
    const { food } = props;

    const basketDispatch = useContext(BasketDispatchContext);  

    const handleAddBasketButton = ()=>{
        const foodItem = {food, quantity: 1}        
        console.log("foodItem", foodItem);
        return insertBasket(basketDispatch, foodItem);
      };

    return (
        <div className="event-item-modern">
            <p className="event-time">${food.price}</p>            
                <h4 className="event-item-modern-title">            
                    {food.name}                    
                </h4>
                <div className="product-featured-button">
                    <button className="button button-primary" onClick={handleAddBasketButton}>Order</button>
                </div>            
            <div className="event-item-modern-text">
                <p>{food.description}</p>
            </div>
        </div>
    );
}

export default FoodItem;