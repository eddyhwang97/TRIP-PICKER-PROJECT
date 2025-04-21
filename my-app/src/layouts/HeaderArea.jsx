import React from 'react';
import { Link } from 'react-router-dom';

function HeaderArea(props) {
    return (
        <div>
            <div>
                <Link to="/">main</Link>
                <Link to="editTrip">editTrip</Link>
                <Link to="dashboard">dashboard</Link>
            </div>
        </div>
    );
}

export default HeaderArea;