import React from 'react';

import '../css/bootstrap.css';
import '../css/fonts.css';
import '../css/style.css';

function About(){    

    return (      
        <div className="rd-navbar-padding">            
        <section className="section section-lg bg-white">
            <div className="container">
            <h2 className="text-center">Why People Choose Us</h2>
            <div className="row row-30 row-md-60">
                <div className="col-md-6 col-lg-4">
                <div className="box-icon-modern">
                    <div className="box-icon-inner decorate-triangle"><span className="icon-xl restaurant-icon-30"></span></div>
                    <div className="box-icon-caption">
                    <h4><a href="/">Friendly Team</a></h4>
                    <p>Commited in deliver the best dishes for your pleasure.</p>
                    </div>
                </div>
                </div>
                <div className="col-md-6 col-lg-4">
                <div className="box-icon-modern">
                    <div className="box-icon-inner decorate-circle"><span className="icon-xl restaurant-icon-11"></span></div>
                    <div className="box-icon-caption">
                    <h4><a href="/">Fresh Food</a></h4>
                    <p>We cook with the best fresh and organic ingredients.</p>
                    </div>
                </div>
                </div>
                <div className="col-md-6 col-lg-4">
                <div className="box-icon-modern">
                    <div className="box-icon-inner decorate-rectangle"><span className="icon-xl restaurant-icon-36"></span></div>
                    <div className="box-icon-caption">
                    <h4><a href="/">Quality Cuisine</a></h4>
                    <p>Our recipes are unique or adaptation from great ones.</p>
                    </div>
                </div>
                </div>
                <div className="col-md-6 col-lg-4">
                <div className="box-icon-modern">
                    <div className="box-icon-inner decorate-circle"><span className="icon-xl restaurant-icon-27"></span></div>
                    <div className="box-icon-caption">
                    <h4><a href="/">Best Service</a></h4>
                    <p>We monitor the ingredients utilized for cooking our best dishes. We allow each online food request to be tracked and preserve the customer sensitive information safely.</p>
                    </div>
                </div>
                </div>
                <div className="col-md-6 col-lg-4">
                <div className="box-icon-modern">
                    <div className="box-icon-inner decorate-triangle"><span className="icon-xl restaurant-icon-34"></span></div>
                    <div className="box-icon-caption">
                    <h4><a href="/">Diverse Menu</a></h4>
                    <p>Variety of amazing dishes is our especiality. From Pacific Salmon until Octopus from Atlantic sea.</p>
                    </div>
                </div>
                </div>
                <div className="col-md-6 col-lg-4">
                <div className="box-icon-modern">
                    <div className="box-icon-inner decorate-rectangle"><span className="icon-xl restaurant-icon-26"></span></div>
                    <div className="box-icon-caption">
                    <h4><a href="/">Affordable Prices</a></h4>
                    <p>We have the advantage to offer competitive rates because of cryptocurrency, no intermediaries, no extra taxes.</p>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>
        <section className="parallax-container" data-parallax-img="images/parallax-img-4.jpg">
            <div className="parallax-content section-xl context-dark text-center bg-dark-filter bg-dark-filter-2">
            <div className="container">
                <h2>Testimonials</h2>                
                <div className="slick-slider carousel-parent slick-style-1" data-arrows="true" data-loop="false" data-dots="false" data-swipe="true" data-items="1" data-child="#child-carousel" data-for="#child-carousel">
                <div className="item">
                    <div className="testimonials-modern">
                    <div className="testimonials-modern-text">
                        <p>The effort to create a unique environment that offers a singular experience to allow any customer to request food online using a cryptocurrency safely is fantastic.</p>
                    </div>
                    <div className="testimonials-modern-name">Davi Alves</div>
                    </div>
                </div>                              
            </div>
                
            </div>
            </div>
        </section>  
        <section className="section section-lg section-inset-1 bg-gray-1 pt-lg-0 invisible">
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
    );
}


export default About;
