import { useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { DeleteServiceConfirmation } from './DeleteServiceConfirmation';
import { deleteService } from '../api';
import { EditService } from './EditService';
import { Notification, useToaster } from 'rsuite';
import { AddAppointment } from './AddAppointment';

export const ListedService = ({u,i,currentUser,service,setServices}) => {

    const [showDeleteConfirmation,setShowDeleteConfirmation] = useState(false);
    const [showAddAppointment,setShowAddAppointment] = useState(false);
    const [s , setS] = useState(service);
    const [showEditService, setShowEditService] = useState(false);
    const toaster = useToaster();


    const handleDeleteService = async () => {
        const response = await deleteService(service._id);
        // console.log(response);
        if(response.data?.message){

            toaster.push(<Notification type={'error'} header={'error'} closable ><p>{response.data.message}</p></Notification>, {placement :'bottomEnd', duration:3000});
        }else {

            setServices( services => services.filter( (serv,i) => serv._id !== s._id && serv));
            setShowDeleteConfirmation(false);
            toaster.push(<Notification type={'success'} header={'success'} closable ><p>Service deleted successfully</p></Notification>, {placement :'bottomEnd', duration:3000});
        }
        // console.log(2);
    }

    return (<>

        <li key={i}>{s.title}
            <br />
            <OverlayTrigger placement={'right'}
            overlay={
                <Tooltip id={`tooltip-right`}>
                    {s.description || 'No description available'}
                </Tooltip>
            }>
                <Button variant="info">Description</Button>
            </OverlayTrigger>

            {/* {console.log(currentUser._id,u._id)} */}
            
            {(currentUser?.role === 'admin' || currentUser?._id === u._id)
                && <>
                <Button variant="warning" style={{margin:'0 1rem'}} onClick={() => setShowEditService(true)}>Edit</Button>
                <Button variant="danger" onClick={ () => setShowDeleteConfirmation(true)}>Delete</Button>
                <EditService service={s} setService={setS}  setShowEditService={setShowEditService} showEditService={showEditService}/>
                <DeleteServiceConfirmation showDeleteConfirmation={showDeleteConfirmation} 
                    setShowDeleteConfirmation={setShowDeleteConfirmation} onDeleteService={handleDeleteService}
                />
            </>}
            {currentUser?.role === 'customer' && 
                <>
                    <Button variant="primary" style={{marginLeft:'1rem'}} onClick={ () => setShowAddAppointment(true)}>Add an appointment</Button>
                    <AddAppointment showAddAppointment={showAddAppointment} setShowAddAppointment={setShowAddAppointment} service={service} provider={u}
                        currentUser={currentUser}
                    />
                </>
            }
        </li>

    </>)
}