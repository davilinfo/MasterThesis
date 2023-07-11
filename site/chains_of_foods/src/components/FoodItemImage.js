import React, {useContext} from 'react';
import { BasketDispatchContext, insertBasket } from '../context/basket';

function FoodItemImage(props){
    const { food } = props;

    const basketDispatch = useContext(BasketDispatchContext);    

    const handleAddBasketButton = ()=>{
        const foodItem = {food, quantity: 1}        
        console.log("foodItem", foodItem);
        return insertBasket(basketDispatch, foodItem);
      };

    return (
        <div className="col-md-6 col-lg-4 wow-outer">
            <div className="wow fadeInUp">
            <div className="product-featured">
                <div className="product-featured-figure"><img src={food.img} alt="" width="350"/>
                <div className="product-featured-button"><button className="button button-primary" onClick={handleAddBasketButton} >order now</button></div>
                </div>
                <div className="product-featured-caption">
                <h4><span className="product-featured-title">{food.name}</span></h4>
                <p className="big">${food.price}</p>
                </div>
            </div>
            </div>
        </div>
    );
}

export default FoodItemImage;