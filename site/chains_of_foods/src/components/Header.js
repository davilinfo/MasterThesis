import React from "react";
import '../css/bootstrap.css';
import '../css/fonts.css';
import '../css/style.css';

function Header() {
  return (            
    <header className="page-header">
        <div class="rd-navbar-wrap">
          <nav class="rd-navbar rd-navbar-classic rd-navbar-original rd-navbar-static rd-navbar--is-stuck" data-layout="rd-navbar-fixed" data-sm-layout="rd-navbar-fixed" data-md-layout="rd-navbar-fixed" data-md-device-layout="rd-navbar-fixed" data-lg-layout="rd-navbar-static" data-lg-device-layout="rd-navbar-static" data-xl-layout="rd-navbar-static" data-xl-device-layout="rd-navbar-static" data-lg-stick-up-offset="46px" data-xl-stick-up-offset="46px" data-xxl-stick-up-offset="46px" data-lg-stick-up="true" data-xl-stick-up="true" data-xxl-stick-up="true">
            <div class="rd-navbar-main-outer">
              <div class="rd-navbar-main">                
                    <div className="rd-navbar-panel">                   
                    <button className="rd-navbar-toggle" data-rd-navbar-toggle=".rd-navbar-nav-wrap"><span></span></button>                  
                    <div className="rd-navbar-brand"><a href="/"><img className="brand-logo-light" src="images/logo-default1-140x57.png" alt="" width="140" height="57" srcset="images/logo-default-280x113.png 2x"/></a></div>
                    </div>
                    <div className="rd-navbar-main-element">
                    <div className="rd-navbar-nav-wrap">                    
                        <ul className="rd-navbar-nav">
                        <li className="rd-nav-item"><a className="rd-nav-link" href="/">Home</a>
                        </li>
                        <li className="rd-nav-item"><a className="rd-nav-link" href="/About">About</a>
                        </li>                      
                        <li className="rd-nav-item"><a className="rd-nav-link" href="/Contact">Contacts</a>
                        </li>
                        </ul><a className="button button-white button-sm" href="#">order now</a>
                    </div>
                    </div><a className="button button-white button-sm" href="#">order now</a>
                </div>
                </div>
            </nav>
        </div>
    </header> 
  );
}
export default Header;