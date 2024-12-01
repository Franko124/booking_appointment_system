import { Button, Form, Modal } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { createAppointment, getServices, getUsers, updateAppointment } from "../api";
import { DatePicker, Notification, TimePicker, useToaster } from "rsuite";


export const AddAppointment = ({showAddAppointment, setShowAddAppointment,service, provider,
    currentUser
}) => {

    const [time, setTime] = useState(new Date());
    const [date, setDate] = useState(new Date());

    const [app,setApp] = useState({
        date : date.toString().split(' ').filter((value,i) => {return (i === 1 || i ===2 || i === 3) && value}).join(' '),
        time: time.toString().split(' ')[4],
        status : 'booked',
        service_id: service._id,
        provider_id: provider._id,
        user_id : currentUser._id
    });
    const [errorMessage, setErrorMessage] = useState('');

    const submitRef = useRef(null);
    const toaster = useToaster();

    const successMessage = (
        <Notification type={'success'} header={'success'} closable >
            <p>New appointment added successfully !</p>
        </Notification>
    );
    const onClose = () => setShowAddAppointment(false);

    const handleChange = (e) => {
        setApp((app) => {
            return {...app,[e.target.name] : e.target.value};
        });
        
        setErrorMessage('');
    };

    const handleSubmit= async (e) => {
        e.preventDefault();

        if((date.getDay() === 0 || date.getDay() === 6) || date.getTime() <= new Date().getTime() ||
            time.getHours() < 8 || time.getHours() > 20
        ){
            setErrorMessage('Wrong day or time.');
        } else {
            setErrorMessage('');

            console.log('app:',app)
            const response = await createAppointment(app);
            if(response.data.message) {
                setErrorMessage(response.data.message);
            }else {
                console.log(response);

                // setAppointment( appoin => {return {...appoin,...updatedData}}); 
                toaster.push(successMessage,{ placement: 'bottomEnd',duration:3000});
                onClose();
            }
        }
    };

    return (
        <>
            <style>{` 
                .rs-picker-popup{
                    z-index:1200;
                    outline: 2px solid gray;
                }
            `}</style>
            <Modal show={showAddAppointment} onHide={onClose} onShow={() => {
                setApp({
                    date : date.toString().split(' ').filter((value,i) => {return (i === 1 || i ===2 || i === 3) && value}).join(' '),
                    time: time.toString().split(' ')[4],
                    status : 'booked',
                    service_id: service._id,
                    provider_id: provider._id,
                    currentUser: currentUser._id
                });
                setErrorMessage('');
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Add a new appointment
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={handleSubmit} >
                    <Form.Group className="mb-3 d-flex justify-content-between" >
                        <Form.Label>Status :</Form.Label>
                        <Form.Check type="radio" inline name="status" label='booked' value={'booked'} checked={app?.status === 'booked'} required onChange={handleChange}/>
                        <Form.Check type="radio" inline name="status" label='finished' value={'finished'} checked={app?.status === 'finished'} required onChange={handleChange}/>
                        
                    </Form.Group>
                    <Form.Group className="mb-3" >
                        <Form.Label>Service</Form.Label>
                        <Form.Select
                            id="service"
                            name="service"
                            required
                            defaultValue={service?.title}
                        >
                            <option value={service?.title} >{service.title}</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" >
                        <Form.Label>Provider</Form.Label>
                        <Form.Select
                            id="provider"
                            name="provider"
                            required
                            defaultValue={provider?.name }
                        >
                            <option value={provider?.name}>{provider.name}</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" style={{display:'flex',gap:'3rem'}} >
                        <Form.Label>Date</Form.Label>
                        <DatePicker format="dd.MM.yyyy" isoWeek shouldDisableDate={(date) => (date.getDay() === 0 || date.getDay() === 6)}
                            limitStartYear={5} limitEndYear={5} value={date} onChange={(date, event) => {
                                if((date.getDay() === 0 || date.getDay() === 6)){
                                    setErrorMessage('Wrong day.');
                                } else {
                                    setErrorMessage('');
                                    setDate(date);
                                }
                                }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" style={{display:'flex',gap:'3rem'}}>
                        <Form.Label>Time</Form.Label>
                        <TimePicker format="HH mm" hideHours={(hour) => (hour < 8 || hour > 20)} 
                            shouldDisableMinute={(minute,date) => minute%60 !== 0 }
                            value={time} placement="auto" onChange={(time,event) => { 
                                if((time.getHours()  < 8 || time.getHours()> 20)){
                                    setErrorMessage('Wrong time.');
                                } else {
                                    setErrorMessage('');
                                    setTime(time);
                                }
                            }}
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
                    Add new appointment
                </Button>

                </Modal.Footer>

            </Modal>
        </>
    );
}