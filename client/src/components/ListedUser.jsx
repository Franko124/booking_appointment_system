import { useState } from "react"
import { Button } from "react-bootstrap";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { deleteUser } from "../api";
import { EditUserData } from "./EditUserData";
import { Notification, useToaster } from "rsuite";


export const ListedUser = ({users,i,u, setUsers, setAppointments}) => {
    const [showEditUserData, setShowEditUserData] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [user, setUser] = useState(u);

    const toaster = useToaster();

    const successMessage = (
        <Notification type={"success"} header={'success'} closable >
            <p>User data deleted successfully !</p>
        </Notification>
    );

    const handleDeleteUser=async () => {
        // console.log('ok');
        const response = await deleteUser(u?._id);

        if(response.data?.message){

            toaster.push(<Notification type={'error'} header={'error'} closable ><p>{response.data.message}</p></Notification>, {placement :'bottomEnd', duration:3000});
        }else {
            setUsers( users => users?.filter( (usr,i) => {
                if(

                    (usr._id !== user._id)  
                ) return usr;
            }));
            setAppointments( (appointments) => appointments.filter( (appointment,i) => {
                if(user.role === 'customer'){
                    if( user._id !== appointment.user_id ) return appointment;
                } else if ( user.role === 'provider'){
                    if( user._id !== appointment.provider_id ) return appointment;
                };
            }));

            toaster.push(successMessage, {placement :'bottomEnd', duration:3000});
        }
        setShowDeleteConfirmation(false);
    };

    return(<>
        <li style={{margin : '1rem'}}>Name : {user.name}
            <i style={{marginLeft:'2rem'}}> Role : {user.role}</i>
            <Button variant="outline-warning" style={{marginLeft:'1rem'}} onClick={() => setShowEditUserData(true)}>Edit this users data</Button>
            <Button variant="outline-danger" style={{marginLeft:'1rem'}} onClick={() => setShowDeleteConfirmation(true)}>Delete this users data</Button>
            <DeleteConfirmation showDeleteConfirmation={showDeleteConfirmation} setShowDeleteConfirmation={setShowDeleteConfirmation}
                onDeleteUserData={handleDeleteUser} user={user} />
            <EditUserData showEditUserData={showEditUserData} setShowEditUserData={setShowEditUserData} user={user} setUser={setUser}/>
            {i < users.length-1 && <hr></hr>}
        </li>
    </>)
}