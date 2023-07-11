import React, {useContext} from "react";
import { NavLink } from "react-router-dom";
import { loadBasketPopup, BasketDispatchContext, BasketStateContext } from "../context/basket";
import '../css/bootstrap.css';
import '../css/fonts.css';
import '../css/style.css';
import BasketPopUp from "./BasketPopUp";

function Header(props) {
  const {items: basketItems} = useContext(BasketStateContext);
  const basketDispatch = useContext(BasketDispatchContext);

  const basketQuantity = basketItems.length;
  const basketTotal = basketItems.map((item)=> item.food.price * item.quantity).reduce((prev,current)=> prev+current,0);
  const handleBasketButton = (event)=>{
    event.preventDefault();
  return loadBasketPopup(basketDispatch);
};

  return (            
    <header className="page-header">
        <div className="rd-navbar-wrap">
          <nav className="rd-navbar rd-navbar-classic rd-navbar-original rd-navbar-static rd-navbar--is-stuck" data-layout="rd-navbar-fixed" data-sm-layout="rd-navbar-fixed" data-md-layout="rd-navbar-fixed" data-md-device-layout="rd-navbar-fixed" data-lg-layout="rd-navbar-static" data-lg-device-layout="rd-navbar-static" data-xl-layout="rd-navbar-static" data-xl-device-layout="rd-navbar-static" data-lg-stick-up-offset="46px" data-xl-stick-up-offset="46px" data-xxl-stick-up-offset="46px" data-lg-stick-up="true" data-xl-stick-up="true" data-xxl-stick-up="true">
            <div className="rd-navbar-main-outer">
              <div className="rd-navbar-main">                
                    <div className="rd-navbar-panel">                   
                    <button className="rd-navbar-toggle" data-rd-navbar-toggle=".rd-navbar-nav-wrap"><span></span></button>                  
                    <div className="rd-navbar-brand"><a href="/"><img className="brand-logo-light" src="images/logo-default1-140x57.png" alt="" width="140" height="57"/></a></div>
                    </div>  

                    <div className="rd-navbar-nav-wrap display-media">
                      <ul className="rd-navbar-nav">
                        <li className="rd-nav-item"><NavLink exact className="rd-nav-link" to="/">Home</NavLink></li>
                        <li className="rd-nav-item"><NavLink exact className="rd-nav-link" to="/Contact">Contacts</NavLink></li>
                        <li className="rd-nav-item"><NavLink exact className="rd-nav-link" to="/About">About</NavLink></li>
                      </ul>
                    </div>                                                            
                     
                    <div className="basket">
                      <div className="basket-info">
                        <table>
                          <tbody>
                            <tr>
                              <td>Quantity</td>
                              <td>:</td>
                              <td>
                                <strong>{basketQuantity}</strong>
                              </td>
                            </tr>
                            <tr>
                              <td>Total</td>
                              <td>:</td>
                              <td>
                                <strong>{basketTotal}</strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <a className="basket-icon" href="#" onClick={handleBasketButton}>
                        <img                            
                          src="images/shopping_basket.jpg" width="30"
                          alt="Basket"
                        />                        
                      </a>
                      <BasketPopUp key="basket" dispatch={basketDispatch}/>
                    </div>                    
                                      
                </div>
              </div>
            </nav>
        </div>
    </header> 
  );
}
export default Header;