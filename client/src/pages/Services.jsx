import { useEffect, useState } from "react";
import { getUsers } from "../api";
import * as jose from 'jose';
import { ListedService } from "../components/ListedService";
import { ListedProvider } from "../components/ListedProvider";

export const Services = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    
    useEffect( () => {
        const token =  sessionStorage.getItem("user");

        if (token) {
            // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            (async () => {
                const verifiedJWT = await jose.jwtVerify(token, new TextEncoder().encode(process.env.REACT_APP_SECRET_KEY));
                setCurrentUser(verifiedJWT.payload);
            })();

        };
        const getProviders = async () => {
            const data = await getUsers();
            const filteredData = data?.filter( (u,i) => u.role === 'provider');
            setUsers( filteredData || [] ); 
            // console.log(data)
        }
        getProviders();
        // console.log(users);
    },[]);
 
    return (
        <div className="container">
            <p>Services</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',justifyItems:'center'}}>
                { users.length > 0 && 
                    users.map( (u,i) => {
                        return (
                            // <ListedService u={u} i={i} key={i} currentUser={currentUser}/>
                            <ListedProvider key={i} u={u} currentUser={currentUser}/>
                        )
                    })
                }
            </div>
        </div>
    )
}