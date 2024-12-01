import { useState, useEffect } from "react";
import { verifyUser } from "../api";

export const Login = () => {
    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setUser((user) => {
            return {...user,[e.target.name] : e.target.value};
        });
    }

    const submitForm =async (e) => {
        e.preventDefault();
        let response = await verifyUser(user);
        if(response){
            console.log(response);
        }else {
            console.log(response);
        }
    };

    return (
        <div style={{display : 'grid' , justifyContent : 'center', marginTop : '4rem'}}>
            <form onSubmit={submitForm} className="login-form">
                <label style={{display: 'flex', justifyContent:'space-between'}}>Email :
                    <input type="email" name="email" className="input" onChange={handleChange} placeholder="name.lastname@email.com" />
                </label>
                <label style={{display: 'flex', justifyContent:'space-between'}}>Password :
                    <input type="password" name="password" className="input" onChange={handleChange} placeholder="Name1234!"/>
                </label>

                <button type="submit" className="button">Login</button>

            </form>
        </div>
    )
}