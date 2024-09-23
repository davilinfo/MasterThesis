import { render, screen } from '@testing-library/react';
import FoodItem from './components/FoodItem';

describe('renders order react button', () => {
  it("search order button", ()=>{
  var food = {price:40, description:'feijoada de feijão preto com carne de feijão', name:'feijoada'}
  render(<FoodItem key={1} food={food}/>);
  screen.debug();
  const button = screen.getByText(/Order/i);
  expect(button).toBeInTheDocument();  
  });  
});

describe('renders FoodItem and search for inexistent button', ()=>{
  it('verify if button does not exist', ()=>{
    var food = {price:40, description:'feijoada de feijão preto com carne de feijão', name:'feijoada'}
    render(<FoodItem key={1} food={food}/>);
    const inexistentButton = screen.queryByText(/Basket/i);
    
    expect(inexistentButton).toBeNull();
  });
});
