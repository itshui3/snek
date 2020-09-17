import React from 'react';

// util
import {BrowserRouter as Router, Route, Redirect}from 'react-router-dom'

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
        <Router>
            <div 
            className='App'
            style={appStyle}
            >
                {
                    true ? <Redirect to='/snek' /> : <Redirect to='/snek' />
                }
                <Route path='/snek' component={SnekBoard}/>
            </div>
        </Router>
    );
}

export default App;