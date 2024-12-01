import { useEffect, useState } from "react";
import { deleteAppointment, getService, getServices, getUser, getUsers } from "../api";
import { Button } from "react-bootstrap";
import { DeleteAppointmentConfirmation } from "./DeleteAppointmentConfirmation";
import { EditAppointment } from "./EditAppointment";

export const ListedAppointment = ({appointment,appointments,setAppointments,i}) => {

    const [provider, setProvider]= useState({});
    const [service , setService ] = useState({});
    const [customer, setCustomer] = useState({});
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showEditAppointment, setShowEditAppointment] = useState(false);
    const [appo, setAppo] = useState(appointment);
    const [services,setServices] = useState([]);
    const [providers, setProviders] = useState([]);

    const handleDeleteAppointment =async () => {
        const response = await deleteAppointment(appointment._id);
        // console.log(response);
        setAppointments((appments) => appments.filter( (app,i) =>  app._id !== appointment._id && app));
        // console.log(1234);
        setShowDeleteConfirmation(false);
    }


    useEffect(() => {
        (async () => {
            const p = await getUser(appo.provider_id);
            const s = await getService(appo.service_id);
            const c = await getUser(appo.user_id);
            setProvider(p);
            setService(s);
            setCustomer(c);
            const allServices = await getServices();
            const allUsers = await getUsers();
            const allProviders = allUsers.filter( (user, i) => user.role === 'provider' && user);

            setServices(allServices);
            setProviders(allProviders);
            // setSelectedService(allProviders?.filter((service,i) => service._id === app.service_id && service));
            

        })();
    },[]);

    return(<>
        <li >

            {(Object.keys(provider).length > 0 && Object.keys(service).length > 0 && Object.keys(customer).length > 0 ) 
                && `${service?.title} between ${provider?.name} and ${customer?.name} at time : ${appo?.time}`
            }
            <br></br>
            <Button variant="warning" style={{marginLeft:'1rem',outline:'1px solid black'}} onClick={() => setShowEditAppointment(true)}>Edit </Button>
            <Button variant="outline-danger" style={{marginLeft:'1rem'}} onClick={() => setShowDeleteConfirmation(true)}>Delete</Button>
            <DeleteAppointmentConfirmation showDeleteConfirmation={showDeleteConfirmation} setShowDeleteConfirmation={setShowDeleteConfirmation}
                onDeleteAppointment={handleDeleteAppointment}  />
            {showEditAppointment && <EditAppointment showEditAppointment={showEditAppointment} setShowEditAppointment={setShowEditAppointment} 
                appointment={appo} setAppointment={setAppo} providers={providers} services={services}/>}
            {i < appointments.length-1 && <hr></hr>}
        </li>
    </>);
};