import React, { useState, useEffect } from 'react';
import FoodItem from './components/FoodItem';
import FoodItemImage from './components/FoodItemImage';

import './css/bootstrap.css';
import './css/fonts.css';
import './css/style.css';
import Header from './components/Header';

const ApiHelper = require('./service/api_helper');
const Config = require('./service/config');

function App() {
  var [foods, setFoods] = useState([]);
  useEffect(()=>{
    async function loadFoods(){      
      var config = new Config.default();
      
      var api = new ApiHelper.default(config.nodeWsAddress);
      //var result = await api.getCustomTransactionByid(config.menuTransactionId, api.menuSchema);
      var result = await api.getMenuTransaction(config.menuBlockId);
      
      var foods = JSON.parse(result.asset.items);
      console.log('loadFoods', foods);
      
      foods = foods.filter(meals=>meals.category===2 || meals.category===3 || meals.category===4).sort(function compare(a, b){        
        if (a.category > b.category){
          return 1;
        }
        if (a.category < b.category){
          return -1;
        }
        return 0;
      });

      setFoods(foods);      
    }

    loadFoods();
  }, []);

  return (
    
      <div className="rd-navbar-padding">      
        <Header/>
        <section className="section section-lg bg-default">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-md-9 col-lg-7 wow-outer">
              <div className="wow slideInDown">
                <h2>Featured Offers</h2>
                <p className="text-opacity-80">We offer a great variety of  the best Italian dishes to our visitors and guests. Below are some of our most popular main dishes and desserts.</p>
              </div>
            </div>
          </div>
          <div className="row row-20 row-lg-30">
            {
              foods.filter(meals=> meals.category===2 || meals.category===3).map(food=>(
                <FoodItemImage key={food.type} food={food}></FoodItemImage>
                )
              )
            }
            {/*<div className="col-md-6 col-lg-4 wow-outer">
              <div className="wow fadeInUp">
                <div className="product-featured">
                  <div className="product-featured-figure"><img src="images/product-2-370x395.jpg" alt="" width="370" height="395"/>
                    <div className="product-featured-button"><button className="button button-primary">order now</button></div>
                  </div>
                  <div className="product-featured-caption">
                    <h4><button className="product-featured-title">Black Pasta</button></h4>
                    <p className="big">$13</p>
                  </div>
                </div>
              </div>
          </div>*/}
            
          </div>
        </div>
        </section>
        <section className="section section-lg bg-gray-1">
          <div className="container">
            <h2 className="text-center">Our Restaurant Menu</h2>
            <div className="row">
              <div className="col-12">
                <div className="tabs-custom tabs-horizontal tabs-classNameic" id="tabs-1">                                                                  
                  <div className="tab-content">
                    <div className="tab-pane fade show active" id="tabs-1-1">
                      <div className="box-event-modern">
                      <h3>mains</h3>
                        {
                          foods.filter(meals=>meals.category===2).map(food=>(
                            <FoodItem key={food.type} food={food}></FoodItem>
                            )
                          )
                        }
                      </div>
                    </div>                                    
                    <div className="tab-pane fade show active" id="tabs-1-2">
                      <div className="box-event-modern">
                        <br/>
                        <br/>
                      <h3>Desserts</h3>
                        {
                          foods.filter(meals=>meals.category===3).map(food=>(
                            <FoodItem key={food.type} food={food}></FoodItem>
                            )
                          )
                        }
                      </div>
                    </div>                  
                    <div className="tab-pane fade show active" id="tabs-1-3">
                      <div className="box-event-modern">
                        <br/>
                        <br/>
                      <h3>Drinks</h3>
                        {
                          foods.filter(meals=>meals.category===4).map(food=>(
                            <FoodItem key={food.type} food={food}></FoodItem>
                            )
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <div className="snackbars" id="form-output-global"></div>
        <script src="js/core.min.js"></script>
        <script src="js/script.js"></script>
      </div>
    
  );
}

export default App;
