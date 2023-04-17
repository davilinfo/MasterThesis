import React from 'react';

function FoodItem(props){
    const { food } = props;

    return (
        <div className="event-item-modern">
            <p className="event-time">${food.price}</p>
            <h4 className="event-item-modern-title"><a href="#">{food.name}</a></h4>
            <div className="event-item-modern-text">
                <p>{food.description}</p>
            </div>
        </div>
    );
}

export default FoodItem;