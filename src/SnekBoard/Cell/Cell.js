import React from 'react';

function Cell({
    rowID, 
    cellID,
    cell,
    placeSnek
}) {
    return (
        <div
        className={`grid_cell ${cell}`}
        onClick={() => placeSnek(rowID, cellID)}
        >
            
        </div>
    );
}

export default Cell;