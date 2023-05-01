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
                <div className="product-featured-button"><a className="button button-primary" href="#" onClick={handleAddBasketButton} >order now</a></div>
                </div>
                <div className="product-featured-caption">
                <h4><a className="product-featured-title" href="#">{food.name}</a></h4>
                <p className="big">${food.price}</p>
                </div>
            </div>
            </div>
        </div>
    );
}

export default FoodItemImage;