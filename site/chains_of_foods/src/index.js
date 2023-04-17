import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Header from './components/Header';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

const routing = (
  <Router>        
      <Header/>        
      <Switch>
          <Route exact path="/" component={App} />
          <Route path="/About" component={About} />
          <Route path="/Contact" component={Contact} />
      </Switch>
      <Footer/>        
  </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
