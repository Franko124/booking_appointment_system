import { useRef, useState } from "react";
import { Notification, useToaster } from "rsuite";
import { createService, updateService } from "../api";
import { Button, Form, Modal } from "react-bootstrap";

export const AddService = ({showAddService, setShowAddService,setServices,provider}) => {
    
    const [srv, setSrv] = useState({
        title: '',
        description: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const submitRef = useRef(null);
    const toaster = useToaster();

    const successMessage = (
        <Notification type={'success'} header={'success'} closable >
            <p>New service added successfully !</p>
        </Notification>
    );
    const onClose = () => setShowAddService(false);

    const handleChange = (e) => {
        setSrv((serv) => {
            return {...serv,[e.target.name] : e.target.value};
        });
        // console.log(srv);
        setErrorMessage('');
    };
    

    const handleSubmit= async (e) => {
        e.preventDefault();
        const newService = {...srv,provider_name : provider.name,provider_specialty: provider.specialty,provider_id : provider._id};
        const response = await createService(newService);
        if(response.data.message) {
            setErrorMessage(response.data.message);
        }else {
            // console.log(response);

            setServices(services => {return {...services,newService}}); 
            toaster.push(successMessage,{ placement: 'bottomEnd',duration:3000});
            onClose();
        }
        // console.log({...srv,provider_name : provider.name,provider_specialty: provider.specialty,provider_id : provider._id});
    };

    return (<>
        <Modal show={showAddService} onHide={onClose} 
        onShow={() => {
            setSrv({
                title: '',
                description: ''
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
                    Cancel
                </Button>

                <Button variant="success" type="submit" onClick={() => {
                    submitRef.current.click();
                }}>
                    Add new service
                </Button>

            </Modal.Footer>

        </Modal>
        
    </>);
}