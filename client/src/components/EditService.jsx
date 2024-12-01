import { useRef, useState } from "react";
import { Notification, useToaster } from "rsuite";
import { updateService } from "../api";
import { Button, Form, Modal } from "react-bootstrap";


export const EditService = ({service,setService, showEditService, setShowEditService}) => {

    const [srv, setSrv] = useState({
        title: service.title,
        description: service.description
    });
    const [errorMessage, setErrorMessage] = useState('');
    const submitRef = useRef(null);
    const toaster = useToaster();

    const successMessage = (
        <Notification type={'success'} header={'success'} closable >
            <p>Service data changed successfully !</p>
        </Notification>
    );
    const onClose = () => setShowEditService(false);

    const handleChange = (e) => {
        setSrv((serv) => {
            return {...serv,[e.target.name] : e.target.value};
        });
        // console.log(srv);
        setErrorMessage('');
    };
    

    const handleSubmit= async (e) => {
        e.preventDefault();
        const response = await updateService(service._id,{title : srv.title,description : srv.description});
        if(response.data.message) {
            setErrorMessage(response.data.message);
        }else {
            // console.log(response);

            setService(servicee => {return {...servicee,title : srv.title,description : srv.description}}); 
            toaster.push(successMessage,{ placement: 'bottomEnd',duration:3000});
            onClose();
        }
    };

    return (<>
        <Modal show={showEditService} onHide={onClose} 
        onShow={() => {
            setSrv({
                title: service.title,
                description: service.description
            });
            setErrorMessage('');
        }}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Edit data for this service
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} >
                    <Form.Group className="mb-3" >
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            placeholder="A title"
                            autoFocus
                            required
                            minLength={3}
                            value={srv?.title}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" >
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            // type="text"
                            as={'textarea'}
                            name="description"
                            placeholder="Some description"
                            rows={3}
                            autoFocus
                            required
                            minLength={6}
                            value={srv?.description}
                            onChange={handleChange}
                        />
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
    </>);
};