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

        console.log(res.data)
    
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