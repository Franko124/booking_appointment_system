import { ListedService } from "./ListedService"
import { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { getServices } from "../api";
import { AddService } from "./AddService";

export const ListedProvider = ({u,currentUser}) => {
    const [services, setServices ] = useState([]);
    const [showAddService, setShowAddService] = useState(false);

    useEffect( () => {
        (async () => {
            const allServices = await getServices();
            if(allServices.length) {
                setServices(allServices.filter( (service,i) => service.provider_id === u._id && service))
            }
        })();
    },[]);
    return (<>
        <Card  style={{width:'23rem',padding:'2rem 1rem',maxHeight:'32rem',overflowY:'auto',display:'grid',rowGap:'1rem'}}>
            {/* <Card.Img variant="top" src="https://fakeimg.pl/120x150/" /> */}
            <h3>{u?.name}</h3>
            <h5>Specialty : {u?.specialty}</h5>
            {u._id === currentUser._id && 
                <><Button variant="secondary"onClick={() => setShowAddService(true)}>Add new service</Button>
                    <AddService setServices={setServices} setShowAddService={setShowAddService} showAddService={showAddService} provider={u}/>
                </>
            }
            <ol>
                <b>Services :</b>
                {services.length > 0 ? services.map((s,i) => {
                    return (  <ListedService  service={s} key={i} currentUser={currentUser} u={u} setServices={setServices}/> )
                }): <b> This provider offers no services for now.</b>}
              
            </ol>
        </Card>
    </>)
}