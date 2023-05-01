import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';
import { 
    BasketStateContext, 
    BasketDispatchContext,
    removeFromBasket,
    loadBasketPopup
 } 
from '../context/basket';

const Basket = () =>{
    const { items } = useContext(BasketStateContext);
    const dispatch = useContext(BasketDispatchContext);
    const history = useHistory();

    const handleRemove = (itemId) =>{
        return removeFromBasket(dispatch, itemId);
    }

    const proceedCheckout = () => {
        loadBasketPopup(dispatch);
        history.push("/checkout");
    }

    return (
        <div>
            <ul>
                {items.map((item)=>{
                    return (
                        <li key={item.name}>
                            <img src={item.img}></img>
                            <div>
                                <p>{item.name}</p>
                                <p>{item.price}</p>
                            </div>
                            <div>
                                <p>
                                    {`${item.quantity}`}
                                </p>
                                <p>{item.quantity * item.price}</p>
                            </div>
                            <button onClick={handleRemove(item.type)}>
                                x
                            </button>
                        </li>
                    );
                })}
            </ul>
            <div>
                <button type="button" onClick={proceedCheckout}>
                    Proceed to checkout
                </button>
            </div>
        </div>
    );
};

export default Basket;