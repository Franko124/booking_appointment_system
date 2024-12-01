import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { LoginOrRegister } from './LoginOrRegister';
import { useEffect, useState } from 'react';
import * as jose from 'jose';

export const Header = () => {
    const [show, setShow] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleClose = () => setShow(false);
    const handleOpen = () => setShow(true);
    const handleLogout = () => {
        sessionStorage.removeItem('user');
        window.location.reload();
    };
    
    const style1 = {
        display:'flex',
        justifyContent:'space-between',
        gap:'2rem',
        margin:'2rem',
        padding:'1rem',
        borderRadius:'12px',
        backgroundColor:'aliceblue',
        alignItems:'center',
    }
    const style2 = {
        display:'flex',
        gap:'2rem',
        textDecoration:'none'
    }

    useEffect(() => {
        const token =  sessionStorage.getItem("user");
        if(token){
            const isLogged = async () => {
                const verifiedJWT = await jose.jwtVerify(token, new TextEncoder().encode(process.env.REACT_APP_SECRET_KEY));
                verifiedJWT && setIsLoggedIn(true);
            };
            isLogged();
        };

    },[]);
    return (
        <div style={style1}>
            <Link to={'/home'}><img src={require('../images/cat-what.gif')} alt='Logo' style={{width:'75px',height:'75px',borderRadius:'12px'}}/></Link>
            <div style={style2}>
                <Link to={'/'} style={{}}><Button variant='outline-primary'>Home</Button></Link>
                <Link to={'/about'}><Button variant='outline-secondary'>About</Button></Link>
                <Link to={'/services'}><Button variant='outline-info'>Services</Button></Link>
            </div>
            { isLoggedIn ? (<Button onClick={handleLogout}>Logout</Button> ): (<Button variant='success' onClick={handleOpen}>Login</Button>)}
            <LoginOrRegister showModal={show} onClose={handleClose} />
        </div>
    );
};