import React from 'react';

import '../css/bootstrap.css';
import '../css/fonts.css';
import '../css/style.css';

function Contact(){    

    return (      
        <div className="rd-navbar-padding">        
            <section className="section section-lg text-center bg-default">
                <div className="container">
                <   h2 className="text-center">Contact the owner</h2>
                    <div className="row row-50">
                        <div className="col-md-6 col-lg-4">
                        <div className="box-icon-classNameic">
                            <div className="box-icon-inner decorate-triangle"><span className="icon-xl linearicons-phone-incoming"></span></div>
                            <div className="box-icon-caption">
                            <h4><a href="/Contact">55-71-99703-5287</a></h4>
                            <p>You can call us anytime</p>
                            </div>
                        </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                        <div className="box-icon-classNameic">
                            <div className="box-icon-inner decorate-circle"><span className="icon-xl linearicons-map2"></span></div>
                            <div className="box-icon-caption">
                            <h4><a href="/Contact">address</a></h4>
                            </div>
                        </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                        <div className="box-icon-classNameic">
                            <div className="box-icon-inner decorate-rectangle"><span className="icon-xl linearicons-paper-plane"></span></div>
                            <div className="box-icon-caption">
                            <h4><a href="mailto:davinet@live.com">davinet@live.com</a></h4>
                            <h4><a href="mailto:davilinfo@gmail.com">davilinfo@gmail.com</a></h4>
                            <p>Feel free to email us your questions</p>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </section>     
        </div>                         
    );
}


export default Contact;
