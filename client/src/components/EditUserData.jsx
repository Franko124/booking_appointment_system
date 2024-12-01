import { Button, Form, Modal } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { updateUser } from "../api";
import { Notification, useToaster } from "rsuite";


export const EditUserData = ({showEditUserData,setShowEditUserData,user, setUser }) => {

    const [usr,setUsr] = useState({
        name: user.name,
        email: user.email,
        // password:'',
        role: user.role,
        appointments : user.appointments
    });
    const [errorMessage, setErrorMessage] = useState('');
    const submitRef = useRef(null);
    const toaster = useToaster();

    const successMessage = (
        <Notification type={'success'} header={'success'} closable >
            <p>User data changed successfully !</p>
        </Notification>
    );
    const onClose = () => setShowEditUserData(false);

    const handleChange = (e) => {
        setUsr((user) => {
            return {...user,[e.target.name] : e.target.value};
        });
        
        setErrorMessage('');
        // console.log(user);
    };
    

    const handleSubmit= async (e) => {
        e.preventDefault();
        // console.log(user,usr);
        const response = await updateUser(user._id,{...user,...usr});
        if(response.data.message) {
            setErrorMessage(response.data.message);
        }else {
            // console.log(response);

            setUser(user => {return {...user,...usr}}); 
            toaster.push(successMessage,{ placement: 'bottomEnd',duration:3000});
            onClose();
        }
    };

    return (
        <Modal show={showEditUserData} onHide={onClose} 
        onShow={() => {
            setUsr({
                name: user.name,
                email: user.email,
                role: user.role,
                appointments : user.appointments,
            });
            setErrorMessage('');
        }}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Edit data for this user
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form onSubmit={handleSubmit} >
                <Form.Group className="mb-3" >
                    <Form.Label>Full name</Form.Label>
                    <Form.Control
                        type="name"
                        id="full-name"
                        name="name"
                        placeholder="Max Planck"
                        autoFocus
                        required
                        minLength={3}
                        value={usr?.name}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" >
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="name@example.com"
                        autoFocus
                        required
                        minLength={6}
                        value={usr?.email}
                        onChange={handleChange}
                    />
                </Form.Group>
                {/* <Form.Group className="mb-3" >
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password"  required minLength={6} onChange={handleChange} value={usr?.password}/>
                </Form.Group> */}
                
                <Form.Group className="mb-3 d-flex justify-content-between" >
                    <Form.Label>Role :</Form.Label>
                    <Form.Check type="radio" inline name="role" label='Customer' value={'customer'} checked={usr?.role === 'customer'} required onChange={handleChange}/>
                    <Form.Check type="radio" inline name="role" label='Provider' value={'provider'} checked={usr?.role === 'provider'} required onChange={handleChange}/>
                    
                </Form.Group>
                
                {errorMessage ? <Form.Group className="mb-3" >
                    <p style={{color:'red'}}>{errorMessage}</p>
                </Form.Group> : ''}

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
                Save changes
            </Button>

            </Modal.Footer>

        </Modal>
    );
}