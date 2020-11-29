import React, { useEffect } from 'react';

function Cell({
    rowID, 
    cellID,
    cell,
    placeSnek
}) {

    useEffect(() => {
        console.log('cell logs upon render', rowID, cellID)
    }, [])

    return (
        <div
        className={`grid_cell ${cell}`}
        onClick={() => placeSnek(rowID, cellID)}
        >
            
        </div>
    );
}

export default Cell;