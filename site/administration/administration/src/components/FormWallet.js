import React from 'react';

function FormWallet({onSubmit}){
    

    async function handleSubmit(e){
        e.preventDefault();
    
        await onSubmit ({

        });
    
        
      }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h3>For generating a new wallet address press the button</h3>
                <div>
                    <button className='button' type='submit'>Generate</button>          
                </div>
            </form> 
        </div>
    );
}

export default FormWallet;