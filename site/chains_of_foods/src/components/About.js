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
                    <h4><a href="#">Friendly Team</a></h4>
                    <p>Morbi tristique senectus et netus et malesuada fames ac turpis.</p>
                    </div>
                </div>
                </div>
                <div className="col-md-6 col-lg-4">
                <div className="box-icon-modern">
                    <div className="box-icon-inner decorate-circle"><span className="icon-xl restaurant-icon-11"></span></div>
                    <div className="box-icon-caption">
                    <h4><a href="#">Fresh Food</a></h4>
                    <p>Cum resistentia mori, omnes elevatuses imperium plac.</p>
                    </div>
                </div>
                </div>
                <div className="col-md-6 col-lg-4">
                <div className="box-icon-modern">
                    <div className="box-icon-inner decorate-rectangle"><span className="icon-xl restaurant-icon-36"></span></div>
                    <div className="box-icon-caption">
                    <h4><a href="#">Quality Cuisine</a></h4>
                    <p>Cum consilium accelerare, omnes absolutioes quaestio fatalis.</p>
                    </div>
                </div>
                </div>
                <div className="col-md-6 col-lg-4">
                <div className="box-icon-modern">
                    <div className="box-icon-inner decorate-circle"><span className="icon-xl restaurant-icon-27"></span></div>
                    <div className="box-icon-caption">
                    <h4><a href="#">Best Service</a></h4>
                    <p>Cum onus studere, omnes consiliumes amor plac.</p>
                    </div>
                </div>
                </div>
                <div className="col-md-6 col-lg-4">
                <div className="box-icon-modern">
                    <div className="box-icon-inner decorate-triangle"><span className="icon-xl restaurant-icon-34"></span></div>
                    <div className="box-icon-caption">
                    <h4><a href="#">Diverse Menu</a></h4>
                    <p>Cum demolitione persuadere, omnes devatioes captis.</p>
                    </div>
                </div>
                </div>
                <div className="col-md-6 col-lg-4">
                <div className="box-icon-modern">
                    <div className="box-icon-inner decorate-rectangle"><span className="icon-xl restaurant-icon-26"></span></div>
                    <div className="box-icon-caption">
                    <h4><a href="#">Affordable Prices</a></h4>
                    <p>Mirabilis, gratis devatios mechanice contactus de neuter, primus vigil.</p>
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
                        <p>A falsis, hibrida peritus fiscina. Devatio de fortis era, talem abaculus! Urbs germanus abnoba est. Pol, a bene exemplar, victrix! Peritus verpas ducunt ad byssus. Cum historia persuadere, omnes decores.</p>
                    </div>
                    <div className="testimonials-modern-name">Davi Alves</div>
                    </div>
                </div>
                <div className="item">
                    <div className="testimonials-modern">
                    <div className="testimonials-modern-text">
                        <p>Silvas cadunt in magnum antverpia! Ubi est grandis gabalium? Trabem sapienter ducunt ad dexter hydra. Devatios sunt assimilatios de alter ignigena. Est ferox lapsus, cesaris. Cum abactus tolerare, omnes.</p>
                    </div>
                    <div className="testimonials-modern-name"> </div>
                    </div>
                </div>                
            </div>
                
            </div>
            </div>
        </section>      
      </div>                        
    );
}


export default About;
