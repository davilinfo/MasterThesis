import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import App from './App';
import About from './components/About';
import Contact from './components/Contact';
import BasketProvider from './context/basket';
import Header from './components/Header';
import Footer from './components/Footer';
import Payment from './components/Payment';

const routing = (    
  <BasketProvider>
      <Router>
        <Header/>   
        <Switch>
            <Route exact path="/" component={App} />
            <Route path="/About" component={About}/>
            <Route path="/Contact" component={Contact} />     
            <Route path="/Payment" component={Payment} />                                 
        </Switch>
        <Footer/>
      </Router>
  </BasketProvider>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
