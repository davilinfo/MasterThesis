import React, {useState} from 'react';

function CustomerRequests(props){
    const [transaction, setTransaction] = useState('');

    setTransaction(props.transaction);

    return (
        <div>
            <span className="order-transaction-id">{transaction}</span>
        </div>
    )
}

export default CustomerRequests;