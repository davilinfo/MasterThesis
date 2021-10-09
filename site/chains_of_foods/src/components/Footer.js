import React from "react";
import { NavLink } from "react-router-dom";
import '../css/bootstrap.css';
import '../css/fonts.css';
import '../css/style.css';

function Footer() {
  return (
    <footer className="section footer-minimal context-dark">
        <div className="container wow-outer">
          <div className="wow fadeIn">
            <div className="row row-60">
              <div className="col-12"><a href="/"><img src="images/logo-default1-140x57.png" alt="" width="140" height="57" srcset="images/logo-default-280x113.png 2x"/></a></div>
              <div className="col-12">
                <ul className="footer-minimal-nav">                  
                  <li><a href="#">Blog</a></li>
                  <li><NavLink exact activeclassName="rd-nav-link" to="/Contact">Contacts</NavLink></li>
                  <li><a href="#">Gallery</a></li>
                  <li><NavLink exact activeclassName="rd-nav-link" to="/About">About</NavLink></li>
                </ul>
              </div>
              <div className="col-12">
                <ul className="social-list">
                  <li><a className="icon icon-sm icon-circle icon-circle-md icon-bg-white fa-facebook" href="#"></a></li>
                  <li><a className="icon icon-sm icon-circle icon-circle-md icon-bg-white fa-instagram" href="#"></a></li>
                  <li><a className="icon icon-sm icon-circle icon-circle-md icon-bg-white fa-twitter" href="#"></a></li>
                  <li><a className="icon icon-sm icon-circle icon-circle-md icon-bg-white fa-youtube-play" href="#"></a></li>
                  <li><a className="icon icon-sm icon-circle icon-circle-md icon-bg-white fa-pinterest-p" href="#"></a></li>
                </ul>
              </div>
            </div>
            <p className="rights"><span>&copy;&nbsp; </span><span className="copyright-year"></span><span>&nbsp;</span><span>Pesto</span><span>.&nbsp;</span><span>All Rights Reserved.</span><span>&nbsp;</span><a href="#">Privacy Policy</a></p>
          </div>
        </div>
      </footer>
  );
}
export default Footer;