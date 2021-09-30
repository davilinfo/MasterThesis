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
                        <h4 className="event-item-modern-title"><a href="#">Trippa Satriano</a></h4>
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
                        <p className="event-time">$5.89</p>
                        <h4 className="event-item-modern-title"><a href="#">Pistachio Passion</a></h4>
                        <div className="event-item-modern-text">
                          <p>Layered pistachio cream, cream cheese custard & whipped cream atop a rich walnut crust.</p>
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
      <section className="section-lg bg-default">
        <div className="container wow-outer">
          <h2 className="text-center wow slideInDown">Recent News</h2>          
          <div className="owl-carousel wow fadeInUp" data-items="1" data-md-items="2" data-lg-items="3" data-dots="true" data-nav="false" data-stage-padding="15" data-loop="false" data-margin="30" data-mouse-drag="false">
            <div className="post-corporate"><a className="badge" href="#">Jul 02, 2019</a>
              <h4 className="post-corporate-title"><a href="#">Genuine Italian Pizza: Authenticity and Choice</a></h4>
              <div className="post-corporate-text">
                <p>As an Italian restaurant, we are very proud of our delicious authentic pizzas. Our three most popular choices are the Rustica, the Toscana and...</p>
              </div><a className="post-corporate-link" href="#">Read more<span className="icon linearicons-arrow-right"></span></a>
            </div>
            <div className="post-corporate"><a className="badge" href="#">Jul 12, 2019</a>
              <h4 className="post-corporate-title"><a href="#">Italian vs. American Spaghetti: Top 5 Differences</a></h4>
              <div className="post-corporate-text">
                <p>Commonly, when we hear there is spaghetti for dinner we will be expecting a red tomato sauce with meat and seasonings poured over long...</p>
              </div><a className="post-corporate-link" href="#">Read more<span className="icon linearicons-arrow-right"></span></a>
            </div>
            <div className="post-corporate"><a className="badge" href="#">aug 02, 2019</a>
              <h4 className="post-corporate-title"><a href="#">The Delicious History of Lasagna and Its Origins</a></h4>
              <div className="post-corporate-text">
                <p>Lasagna, could there be a more perfect dish? It’s comfort food on steroids. Layers of cheese generously piled on top of decadent amounts...</p>
              </div><a className="post-corporate-link" href="#">Read more<span className="icon linearicons-arrow-right"></span></a>
            </div>
            <div className="post-corporate"><a className="badge" href="#">Aug 15, 2019</a>
              <h4 className="post-corporate-title"><a href="#">Making Gelato Like a True Italian: Tips From Our Chef</a></h4>
              <div className="post-corporate-text">
                <p>Most would agree that gelato is the most delicious frozen dessert; the perfect ending to any meal. With origins in Sicily, gelato has been made famous...</p>
              </div><a className="post-corporate-link" href="#">Read more<span className="icon linearicons-arrow-right"></span></a>
            </div>
            <div className="post-corporate"><a className="badge" href="#">Sep 15, 2019</a>
              <h4 className="post-corporate-title"><a href="#">Italian Ingredients You Can Easily Grow at Home</a></h4>
              <div className="post-corporate-text">
                <p>Imagine preparing an Italian dinner but having to stop cooking because you forget an ingredient and must run to the store. How nice would it be to go...</p>
              </div><a className="post-corporate-link" href="#">Read more<span className="icon linearicons-arrow-right"></span></a>
            </div>
            <div className="post-corporate"><a className="badge" href="#">Sep 28, 2019</a>
              <h4 className="post-corporate-title"><a href="#">Our Brief Guide to Pairing Wine and Pasta the Right Way</a></h4>
              <div className="post-corporate-text">
                <p>To Italians, pasta is the food of the gods, and there is nothing better to go with a good pasta than a perfect wine. To the uninitiated, finding the right...</p>
              </div><a className="post-corporate-link" href="#">Read more<span className="icon linearicons-arrow-right"></span></a>
            </div>
            <div className="post-corporate"><a className="badge" href="#">Oct 05, 2019</a>
              <h4 className="post-corporate-title"><a href="#">Top 10 Famous Spring Dishes in Italian Restaurants</a></h4>
              <div className="post-corporate-text">
                <p>Spring is the time for growth and rebirth. One can see this throughout the countrysides of Italy with blooming flowers and budding trees. Springtime is...</p>
              </div><a className="post-corporate-link" href="#">Read more<span className="icon linearicons-arrow-right"></span></a>
            </div>
            <div className="post-corporate"><a className="badge" href="#">Oct 17, 2019</a>
              <h4 className="post-corporate-title"><a href="#">What Makes Some Seasonings Truly Italian?</a></h4>
              <div className="post-corporate-text">
                <p>When thinking of Italian cuisine, dishes like pasta enveloped in hearty sauces come to mind. Certain flavors seem to be found across the different...</p>
              </div><a className="post-corporate-link" href="#">Read more<span className="icon linearicons-arrow-right"></span></a>
            </div>
            <div className="post-corporate"><a className="badge" href="#">Nov 10, 2019</a>
              <h4 className="post-corporate-title"><a href="#">Types of Italian Sausage and Why They Are Different</a></h4>
              <div className="post-corporate-text">
                <p>There are many types of Italian sausage. The main difference in Italian sausage when compared to other sausages is the seasoning. The particular...</p>
              </div><a className="post-corporate-link" href="#">Read more<span className="icon linearicons-arrow-right"></span></a>
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
