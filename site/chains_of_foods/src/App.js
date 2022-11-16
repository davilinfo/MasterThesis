import logo from './logo.svg';

import './css/bootstrap.css';
import './css/fonts.css';
import './css/style.css';

function App() {
  return (
    <div className="rd-navbar-padding">
      <div className="bg-gray-1">
        <section className="section section-lg section-inset-1 bg-gray-1 pt-lg-0">
            <div className="container">
              <div className="row row-50 justify-content-xl-between align-items-lg-center">
                <div className="col-lg-6 wow fadeInLeft">
                  <div className="box-image"><img className="box-image-static" src="images/home-3-1-483x327.jpg" alt="" width="483" height="327"/><img className="box-image-position" src="images/home-3-2-341x391.png" alt="" width="341" height="391"/>
                  </div>
                </div>
                <div className="col-lg-6 col-xl-5 wow fadeInRight">
                  <h2>About Us</h2>
                  <p>Pesto is a family owned and operated Italian Restaurant offering a combination of fresh ingredients and authentic Italian cooking.</p>
                  <p>We will make sure you are served the most authentic and fresh Italian dishes, while offering the best customer service. Our kitchen is committed to providing our guests with the best Italian Cuisine.</p><img src="images/signature-1-140x50.png" alt="" width="140" height="50"/>
                </div>
              </div>
            </div>
          </section>
        </div>
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
            <div className="col-md-6 col-lg-4 wow-outer">
              <div className="wow fadeInUp">
                <div className="product-featured">
                  <div className="product-featured-figure"><img src="images/product-1-370x395.jpg" alt="" width="370" height="395"/>
                    <div className="product-featured-button"><a className="button button-primary" href="#">order now</a></div>
                  </div>
                  <div className="product-featured-caption">
                    <h4><a className="product-featured-title" href="#">Ravioli</a></h4>
                    <p className="big">$8</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 wow-outer">
              <div className="wow fadeInUp">
                <div className="product-featured">
                  <div className="product-featured-figure"><img src="images/product-2-370x395.jpg" alt="" width="370" height="395"/>
                    <div className="product-featured-button"><a className="button button-primary" href="#">order now</a></div>
                  </div>
                  <div className="product-featured-caption">
                    <h4><a className="product-featured-title" href="#">Black Pasta</a></h4>
                    <p className="big">$13</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 wow-outer">
              <div className="wow fadeInUp">
                <div className="product-featured">
                  <div className="product-featured-figure"><img src="images/product-3-370x395.jpg" alt="" width="370" height="395"/>
                    <div className="product-featured-button"><a className="button button-primary" href="#">order now</a></div>
                  </div>
                  <div className="product-featured-caption">
                    <h4><a className="product-featured-title" href="#">Gelato</a></h4>
                    <p className="big">$4</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section section-lg bg-gray-1">
        <div className="container">
          <h2 className="text-center">Our Restaurant Menu</h2>
          <div className="row">
            <div className="col-12">
              <div className="tabs-custom tabs-horizontal tabs-classNameic" id="tabs-1">
                <ul className="nav nav-tabs nav-tabs-classNameic">
                  <li className="nav-item" role="presentation"><a className="nav-link active" href="#tabs-1-1" data-toggle="tab">mains</a></li>
                  <li className="nav-item" role="presentation"><a className="nav-link" href="#tabs-1-2" data-toggle="tab">Desserts</a></li>
                  <li className="nav-item" role="presentation"><a className="nav-link" href="#tabs-1-3" data-toggle="tab">drinks</a></li>
                </ul>
                <div className="tab-content">
                  <div className="tab-pane fade show active" id="tabs-1-1">
                    <div className="box-event-modern">
                      <div className="event-item-modern">
                        <p className="event-time">$25.89</p>
                        <h4 className="event-item-modern-title"><a href="#">Osso Buco</a></h4>
                        <div className="event-item-modern-text">
                          <p>Osso Buco is one of the Italian greats - slow cooked veal in a white wine tomato sauce. Meltingly tender, this is both hearty and luxurious.</p>
                        </div>
                      </div>
                      <div className="event-item-modern">
                        <p className="event-time">$16.89</p>
                        <h4 className="event-item-modern-title"><a href="#">Pappardelle Mimmo</a></h4>
                        <div className="event-item-modern-text">
                          <p>This delicious dish tops long, wide pasta with scallops, lobster, asparagus, butter, sage and truffle oil to cater every palate.</p>
                        </div>
                      </div>
                      <div className="event-item-modern">
                        <p className="event-time">$17.89</p>
                        <h4 className="event-item-modern-title"><a href="#">Herb encrusted ahi tuna</a></h4>
                        <div className="event-item-modern-text">
                          <p>Thinly sliced herb encrusted ahi tuna topped with diced tomatoes, olives, capers, red onions and fennel. Perfect choice even for the first-time visitors!</p>
                        </div>
                      </div>
                      <div className="event-item-modern">
                        <p className="event-time">$18.89</p>
                        <h4 className="event-item-modern-title"><a href="#">Filetto Di Manzo</a></h4>
                        <div className="event-item-modern-text">
                          <p>Wonderful combination of prime tenderloin, winter greens, Jerusalem artichoke puree, and oxtail reduction sauce.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="tabs-1-2">
                    <div className="box-event-modern">
                      <div className="event-item-modern">
                        <p className="event-time">$20.89</p>
                        <h4 className="event-item-modern-title"><a href="#">Tiramisu</a></h4>
                        <div className="event-item-modern-text">
                          <p>A Pesto’s favorite - classNameic Italian dessert made with lady fingers, Mascarpone cheese & espresso. Perfect for both kids and adults.</p>
                        </div>
                      </div>
                      <div className="event-item-modern">
                        <p className="event-time">$6.89</p>
                        <h4 className="event-item-modern-title"><a href="#">Cannoli</a></h4>
                        <div className="event-item-modern-text">
                          <p>Trio tower of cannoli filled with smooth ricotta, sugar & cinnamon, with chocolate & raspberry sauces. Single cannoli is also available.</p>
                        </div>
                      </div>                      
                      <div className="event-item-modern">
                        <p className="event-time">$4.89</p>
                        <h4 className="event-item-modern-title"><a href="#">Chocolate-and-Pistachio Biscotti</a></h4>
                        <div className="event-item-modern-text">
                          <p>At Pesto, we vary these wonderful nutty biscotti, while also dipping them in melted dark chocolate for an extra layer of flavor.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="tabs-1-3">
                    <div className="box-event-modern">
                      <div className="event-item-modern">
                        <p className="event-time">$10.89</p>
                        <h4 className="event-item-modern-title"><a href="#">Aperol Spritz</a></h4>
                        <div className="event-item-modern-text">
                          <p>The most popular drink in Venice: refreshing, easygoing &…happy! Perfect to be sipped as an “Aperitivo” just before dinner - delightful!</p>
                        </div>
                      </div>
                      <div className="event-item-modern">
                        <p className="event-time">$9.89</p>
                        <h4 className="event-item-modern-title"><a href="#">Negroni</a></h4>
                        <div className="event-item-modern-text">
                          <p>Reward yourself with a moment of relaxation & pure pleasure while enjoying the full flavour & simplicity of a Negroni, an iconic Italian cocktail.</p>
                        </div>
                      </div>
                      <div className="event-item-modern">
                        <p className="event-time">$11.89</p>
                        <h4 className="event-item-modern-title"><a href="#">Negroni Sbagliato</a></h4>
                        <div className="event-item-modern-text">
                          <p>A cocktail for those who prefer more delicate flavours but nonetheless want a drink full of taste & personality.</p>
                        </div>
                      </div>
                      <div className="event-item-modern">
                        <p className="event-time">$8.89</p>
                        <h4 className="event-item-modern-title"><a href="#">White Peach Bellini</a></h4>
                        <div className="event-item-modern-text">
                          <p>White Peach Bellini is a classNameic drink from Venice Italy of white peach purée and Prosecco. It is one of our most popular drinks at Pesto.</p>
                        </div>
                      </div>
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
