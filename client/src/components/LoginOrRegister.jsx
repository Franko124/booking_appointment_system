import { useEffect, useRef, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { createUser, verifyUser } from "../api";
import * as jose from 'jose';
import axios from "axios";
import { Notification, useToaster } from "rsuite";

export const LoginOrRegister = ({showModal, onClose}) => {

    const [login ,setLogin] = useState(true);
    const [user,setUser] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const submitRef = useRef(null);

    const toaster = useToaster();
    const successMessage = (
        <Notification type={'success'} header={'success'} closable >
            <p>User registered successfully ! Try to login now .</p>
        </Notification>
    );
    // console.log(user);

    const handleChange = (e) => {
        setUser((user) => {
            return {...user,[e.target.name] : e.target.value};
        });
        setErrorMessage('');
        // console.log(user);
    };
    const changeForm = () => {
        setLogin( (login) => !login);
        
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // const form = e.target;
        // console.log(user);
        // const formData = new FormData(form);
        // const formJson = Object.fromEntries(formData.entries());
        // console.log(formData,formJson);
        try {
            if(login){
                // submit function for login

                let response = await verifyUser(user);
                if(response.success){
                    // const secretKey = process.env.REACT_APP_SECRET_KEY;
                    // const decodedToken = await jose.jwtVerify(response.token,new TextEncoder().encode(secretKey));
                    // console.log('token decoded : ',decodedToken);
                    sessionStorage.setItem('user',response.token);
                    axios.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;

                    // onClose();
                        window.location.reload();
                    // console.log('login res: ',response);
                }else {
                    setErrorMessage(response.message);
                }
            } else {
                // submit function for register
                let response = await createUser(user);

                if(response.data.message){
                    setErrorMessage(response.data.message);
                } else {
                    toaster.push(successMessage,{ placement: 'bottomEnd',duration:4000});
                    setLogin(true);

                    // console.log('register res: ',response);
                }
            };
        } catch (error) {
            setErrorMessage(error.message);
            console.log(error.message);
        }
        

    };

    useEffect( () => {
        setUser(!login ? {
            name:'',
            email:'',
            password:'',
            role:'customer',
            join_date : new Date(),
            appointments : [],
            
        } : {
            email:'',
            password:'',
        });
        setErrorMessage('');

    },[login]);
    return ( 
        <>
            <Modal show={showModal} onHide={onClose} onShow={() => {
                setUser({
                    email:'',
                    password:'',
                });
                setErrorMessage('');
                setLogin(true);
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {login ? 'Login or ===> ' : 'Register or ===> '}
                        <Button variant="outline-primary" onClick={changeForm}>
                            {login ? 'Change to register' : 'Change to login'}
                        </Button>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={handleSubmit} >
                    {!login ? <Form.Group className="mb-3" >
                        <Form.Label>Full name</Form.Label>
                        <Form.Control
                            type="name"
                            id="full-name"
                            name="name"
                            placeholder="Max Planck"
                            autoFocus
                            required
                            minLength={3}
                            value={user?.name}
                            onChange={handleChange}
                        />
                    </Form.Group> : ''}
                    <Form.Group className="mb-3" >
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            autoFocus
                            required
                            minLength={6}
                            value={user?.email}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" >
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password"  required minLength={6} onChange={handleChange} value={user?.password}/>
                    </Form.Group>
                    {!login ?
                        <Form.Group className="mb-3 d-flex justify-content-between" >
                            <Form.Label>Role :</Form.Label>
                            <Form.Check type="radio" inline name="role" label='Customer' value={'customer'} defaultChecked required onChange={handleChange}/>
                            <Form.Check type="radio" inline name="role" label='Provider' value={'provider'} required onChange={handleChange}/>
                            
                        </Form.Group> : ''
                    }
                    {errorMessage ? <Form.Group className="mb-3" >
                        <p style={{color:'red'}}>{errorMessage}</p>
                    </Form.Group> : ''}

                    {/* <Button variant="danger" type="submit">
                        submit
                    </Button> */}
                    <Button type="submit" ref={submitRef} style={{display:'none'}}/>
                </Form>
                </Modal.Body>
                <Modal.Footer>

                <Button variant="secondary" onClick={onClose}>
                    Cancel changes
                </Button>

                <Button variant="success" type="submit" onClick={() => {
                    submitRef.current.click();
                }}>
                    {login ? 'Login' : 'Register'}
                </Button>
                {/* <p>{Object.keys(user).map( (u,i) => {
                    return ( <button key={i} style={{width:'25px',height:'25px'}}>{i}</button>)
                })}</p> */}
                </Modal.Footer>

            </Modal>
        </>
    )
}