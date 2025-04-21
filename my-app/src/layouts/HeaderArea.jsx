import React from 'react';
import { Link } from 'react-router-dom';
import smallLogo from '../assets/logo/small-logo.png';

function HeaderArea(props) {
    const style ={
        display: 'flex',
        fontSize: '20px',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6'
    }
    return (
        <>
        <div className='header'>
            <section className='logo-box'>
                <img src={smallLogo}/>
            </section>
        </div>

            <div style={style}>
                <Link to="/">main</Link>
                <Link to="editTrip">editTrip</Link>
                <Link to="dashboard">dashboard</Link>
                <Link to="login">login</Link>
                <Link to="join">join</Link>
            </div>
        </>
    );
}

export default HeaderArea;