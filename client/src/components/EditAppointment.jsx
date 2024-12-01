import { Button, Form, Modal } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { getServices, getUsers, updateAppointment } from "../api";
import { DatePicker, Notification, TimePicker, useToaster } from "rsuite";


export const EditAppointment = ({showEditAppointment, setShowEditAppointment, appointment, setAppointment,
    services, providers,
}) => {

    const [time, setTime] = useState(new Date(`${appointment?.date} ${appointment?.time}`));
    const [date, setDate] = useState(new Date(appointment?.date));

    const [app,setApp] = useState({
        time: time,
        date: date,
        status : appointment.status,
        service_id: appointment.service_id,
        provider_id: appointment.provider_id
    });
    const [errorMessage, setErrorMessage] = useState('');

    const [selectedService, setSelectedService] = useState(services?.filter((service,i) => service._id === app.service_id && service));
    const [filteredProviders, setFilteredProviders] = useState( providers.filter( (provider,i) => provider._id === selectedService[0]?.provider_id && provider ));

    const [selectedProvider, setSelectedProvider] = useState(providers.length > 0 && providers?.filter((service,i) => service._id === app.service_id && service));

    const submitRef = useRef(null);
    const toaster = useToaster();

    const successMessage = (
        <Notification type={'success'} header={'success'} closable >
            <p>Appointment data changed successfully !</p>
        </Notification>
    );
    const onClose = () => setShowEditAppointment(false);

    const handleChange = (e) => {
        // console.log(e.target.name, e.target.value);
        setApp((app) => {
            return {...app,[e.target.name] : e.target.value};
        });
        
        setErrorMessage('');
        // console.log(user);
    };

    const handleSubmit= async (e) => {
        e.preventDefault();
        // console.log(app);
        // console.log({
        //     time: time,
        //     date: date,
        //     status : appointment.status,
        //     service_id: appointment.service_id,
        //     provider_id: appointment.provider_id
        // })
        const form = e.target;
        // console.log(user);
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        console.log(formData,{...formJson,
            date : date.toString().split(' ').filter((value,i) => {return (i === 1 || i ===2 || i === 3) && value}).join(' '),
            time: time.toString().split(' ')[4]}
        );
        const provider_id =providers.filter( (provider,i) => provider._id === selectedService[0]?.provider_id && provider)[0]._id;
        const service_id = selectedService[0]?._id;

        const updatedData = {...formJson,
            date : date.toString().split(' ').filter((value,i) => {return (i === 1 || i ===2 || i === 3) && value}).join(' '),
            time: time.toString().split(' ')[4],
            provider_id,
            service_id
        };
        // console.log(providers.filter( (provider,i) => provider._id === selectedService[0]?.provider_id && provider)[0]._id,selectedService[0]?._id);
        // console.log(user,usr);
        const response = await updateAppointment(appointment._id,{...appointment,...updatedData});
        if(response.data.message) {
            setErrorMessage(response.data.message);
        }else {
            console.log(response);

            setAppointment( appoin => {return {...appoin,...updatedData}}); 
            toaster.push(successMessage,{ placement: 'bottomEnd',duration:3000});
            onClose();
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
            <Modal show={showEditAppointment} onHide={onClose} onShow={() => {
                setApp({
                    time: time,
                    date: date,
                    status : appointment.status,
                    service_id: appointment.service_id,
                    provider_id: appointment.provider_id
                });
                // setFilteredProviders(providers.filter( (provider,i) => provider._id === selectedService.provider_id && provider));
                setSelectedService(services?.filter((service,i) => service._id === app.service_id && service));
                setFilteredProviders(providers.filter( (provider,i) => provider._id === selectedService[0].provider_id && provider ))
                console.log(selectedService)
                setErrorMessage('');
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Edit this appointment
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
                            onChange={e => {
                                setSelectedService(services.filter( (s,i) => {
                                    return s.title === e.target.value && s} 
                                ));
                                setFilteredProviders(providers.filter( (provider,i) => provider._id !== selectedService[0]?.provider_id && provider));
                            }}
                            value={selectedService?.title || selectedService[0]?.title}
                        >
                            {services.map( (service,i) => {
                                return <option value={service?.title} key={i}>{service.title}</option>
                            })}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" >
                        <Form.Label>Provider</Form.Label>
                        <Form.Select
                            id="provider"
                            name="provider"
                            required
                            // value={selectedProvider?.name}
                            value={selectedProvider[0]?.name }
                            onChange={(e) => setSelectedProvider(e.target.value)}
                        >
                            {filteredProviders?.map( (provider,i) => {
                                return <option value={provider.name} key={i}>{provider.name}</option>
                            })}

                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" style={{display:'flex',gap:'3rem'}} >
                        <Form.Label>Date</Form.Label>
                        <DatePicker format="dd.MM.yyyy" isoWeek shouldDisableDate={(date) => (date.getDay() === 0 || date.getDay() === 6)}
                            limitStartYear={5} limitEndYear={5} value={date} onChange={(date, event) => { setDate(date)}}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" style={{display:'flex',gap:'3rem'}}>
                        <Form.Label>Time</Form.Label>
                        <TimePicker format="HH mm" hideHours={(hour) => (hour < 8 || hour > 20)} 
                            value={time} placement="auto" onChange={(time,event) => { setTime(time)}}
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
        </>
    );
}