import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormOrder from './components/FormOrder';

describe('verify input change event', ()=>{
    it('verify input change event', async ()=>{
        render(<FormOrder/>);

        screen.debug();
        await userEvent.type(screen.getAllByRole('textbox')[0], 'Javascript');
        screen.debug();
        
        expect(screen.getByText(/Javascript/)).toBeInTheDocument();
                
    });
});