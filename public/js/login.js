import axios from "axios";
import { displayAlert } from "./alerts";

export const login = async (email, password) => {
    try{
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/auth-users/login',
            data: {
                email,
                password
            }
        })
    if(res.data.status === 'success'){
        displayAlert('success', 'Successfully logged in');
        window.setTimeout(()=> {
            location.assign('/')
        }, 1500)
    }

    } catch(error){
        displayAlert('error', error.response.data.message);
    }

}

export const logginOut = async () => {

    try{
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:3000/api/v1/auth-users/logout',
        })

        console.log(res)
    if(res.data.status === 'success')location.reload(true)
    } catch(error){
        displayAlert('error', 'Error logging out. Please, try again.');
    }

}