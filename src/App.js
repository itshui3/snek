import React from 'react';

// style
import './App.css';
// compos
import SnekBoard from './page/SnekBoard'

const appStyle = {
    display: 'flex',
    flexDirection: 'column'
}

function App() {
    return (
        <div 
        className='App'
        style={appStyle}
        >
            <SnekBoard />
        </div>
    );
}

export default App;