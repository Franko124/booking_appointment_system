import { useEffect, useState } from "react";
import { getAppointment, getAppointments, getService, getUser, getUsers } from "../api";
import * as jose from 'jose';
import { MyDatePicker } from "../components/MyDatePicker";
import { ListedUser } from "../components/ListedUser";
import { ListedAppointment } from "../components/ListedAppointment";

export const Home = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);

    useEffect( () => {
        const token =  sessionStorage.getItem("user");

        if (token) {
            // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            (async () => {
                const verifiedJWT = await jose.jwtVerify(token, new TextEncoder().encode(process.env.REACT_APP_SECRET_KEY));
                if(verifiedJWT.payload.role === 'admin'){
                    const data = await getUsers();
                    if(data){
                        setUsers(data.filter( (u,i) =>  (u.role === 'customer' || u.role === 'provider') && u ));
                    };
                };
                setCurrentUser(verifiedJWT.payload);
                const apps = await getAppointments();
                const filteredAppointments= apps?.filter( (app,i) => 
                    (new Date(app.date).setHours(0,0,0,0) === new Date(selectedDate.toString().split(' ').slice(0,4).join(' ')).setHours(0,0,0,0) ) && app
                );
                setAppointments(filteredAppointments);
            })();

        };
    },[]);

    useEffect(() =>{
        !!Object.keys(currentUser).length && selectedDate && 
        ( async  () => {
            setAppointments([]);
            const apps = await getAppointments();
            const filteredAppointments= apps?.filter( (app,i) => 
                (new Date(app.date).setHours(0,0,0,0) === new Date(selectedDate.toString().split(' ').slice(0,4).join(' ')).setHours(0,0,0,0) ) && app
            );
            // setAppointments([]);
            if(currentUser.role === 'admin'){
                setAppointments(filteredAppointments)
            } else if( currentUser.role === 'customer'){
                // console.log(filteredAppointments.filter( (appointment,i) => appointment.user_id === currentUser._id && appointment));
                setAppointments(filteredAppointments.filter( (appointment,i) => appointment.user_id === currentUser._id && appointment));
            }
            
            console.log(appointments);
        })();
    },[selectedDate] );

    
    return (
        <>
            <h3>Home page</h3>
            <p>
                {`Welcome ${currentUser.name || 'guest'}`}
            </p>
            
            {/* showing all users */}
            { currentUser.role === 'admin' ? 
                <div style={{maxHeight:'35rem',maxWidth:'80rem', overflowY:'auto',outline:'3px solid lightgray',
                    borderRadius:'5px',padding:'2rem',backgroundColor:'beige',WebkitTextStroke:'0.2px lightblue',fontWeight:'700',margin:'3rem 0'}}
                >
                    <h3 >List of users</h3>
                    <ul  >
                    {users.map( (u,i) => {
                        return (<ListedUser key={i} u={u} i={i} users={users} setUsers={setUsers} setAppointments={setAppointments} />);
                    })}
                    </ul>
                </div> : null
            }


            {/* showing appointments */}
            <div  style={{ display:'flex',alignItems:"flex-start",justifyContent:"space-between",height:'25rem',
                padding:'2rem 1rem',backgroundColor:'#E2C39D',outline:'3px solid gold',borderRadius:'5px'}} 
            
            >
                <div style={{width:'45%'}}>
                    <MyDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                </div>
                <div style={{backgroundColor:'darkslateblue',width:'5px',height:'-webkit-fill-available',borderRadius:'10px'}}>
                </div>
                <div style={{width:'45%',maxHeight:'-webkit-fill-available',overflowY:'auto'}}>
                    {!!Object.keys(currentUser).length ?
                        <>
                            <h4>
                                Appointments for this day :
                            </h4>
                            <ul>
                                {selectedDate ? 
                                    (appointments?.length > 0) 
                                    ? appointments.map(  (appointment,i) => ( 
                                        <ListedAppointment setAppointments={setAppointments} appointment={appointment} i={i} appointments={appointments} key={i}/> ))
                                    : <b>No appointments for this day</b>
                                : <b>Select a date to see if there are any appointments </b>
                                }
                            </ul>
                        </>
                    :
                        <h4>
                            You must login to add or check your appointments
                        </h4>
                    }
                </div>
            </div>
        </>
    )
};