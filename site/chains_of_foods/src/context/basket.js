import React, {createContext, useReducer, useEffect} from "react";
import LocalStorage from '../hook/jsLocalStorage';

const initialState = {
    isBasketOpen:false,
    items:[]
};

export const BasketStateContext = createContext();
export const BasketDispatchContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case "LOAD_BASKET_POPUP":
            return {
                ...state,
                isBasketOpen: !state.isBasketOpen
            };
        case "INSERT_BASKET":            
            const id = action.payload.basketItem.food.type;
            const existsItemInBasket = state.items.map((item)=> item.food.type).includes(id);
            let basketItems = null;
            if (existsItemInBasket){
                const items = state.items.map((item)=>{
                    if (item.food.type == id){
                        return {
                            ...item,
                            quantity: item.quantity + 1
                        };
                    }
                    return item;
                });
                basketItems = [...items];
            }else{
                basketItems = [action.payload.basketItem];
            }
            return {
                ...state,
                items: basketItems
            };
        case "REMOVE_FROM_BASKET":
            console.log(action.payload.basketItem);
            return {
                ...state,
                items: state.items.length > 0  && action.payload.basketItem ? state.items.filter((item)=>
                item.food.type != action.payload.basketItem.food.type) : []
            };
        case "CLEAR_ALL":
            return {
                ...state,
                initialState
            };
        default:
            throw new Error (`Unknown action: ${action.type}`);
    }
}

export const loadBasketPopup = (dispatch)=>{
    console.log("dispatch", dispatch);
    return dispatch({
        type: "LOAD_BASKET_POPUP"
    }); 
};

export const insertBasket = (dispatch, basketItem)=>{
    return dispatch({
        type: "INSERT_BASKET",
        payload:{
            basketItem: basketItem
        }
    }); 
};

export const removeFromBasket = (dispatch, basketItemId)=>{
    return dispatch({
        type: "REMOVE_FROM_BASKET",
        payload:{
            basketItemId: basketItemId
        }
    }); 
};

export const clearBasket = (dispatch)=>{
    return dispatch({
        type: "CLEAR_ALL",

    })
}

const BasketProvider = ({children})=> {
    
    const [persistedBasketItems, setPersistedBasketItems] = LocalStorage("basketItems",[]);
    const persistedBasketState = {
        isBasketOpen: false,
        items: persistedBasketItems || []
    };
    const [state, dispatch] = useReducer(reducer, persistedBasketState);
    useEffect(()=>{
        console.log("dispatch", dispatch);
        setPersistedBasketItems(state.items);
    }, [JSON.stringify(state.items)]);
    return (
        <BasketDispatchContext.Provider value={dispatch}>
            <BasketStateContext.Provider value={state}>
                {children}
            </BasketStateContext.Provider>
        </BasketDispatchContext.Provider>
    );
}

export default BasketProvider;