import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';
import { 
    BasketStateContext, 
    BasketDispatchContext,
    removeFromBasket,
    loadBasketPopup
 } 
from '../context/basket';

const BasketPopUp = () =>{
    const { items, isBasketOpen } = useContext(BasketStateContext);
    const dispatch = useContext(BasketDispatchContext);
    const history = useHistory();

    const cssName = isBasketOpen ? "basket-popup-active" : "basket-popup";

    const handleRemove = (itemId) =>{
        return removeFromBasket(dispatch, itemId);              
    }

    const proceedCheckout = () => {
        loadBasketPopup(dispatch);
        history.push("/checkout");
    }

    return (
        <div className={cssName}>
            <ul>
                {items.map((item)=>{
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
                            <button className="basket-popup-remove-item" onClick={()=> handleRemove(item.food.type)}>
                                x
                            </button>
                        </li>
                    );
                })}
            </ul>
            <div>
                <button type="button" onClick={()=>proceedCheckout}>
                    Proceed to checkout
                </button>
            </div>
        </div>
    );
};

export default BasketPopUp;