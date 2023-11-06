import axios from "axios";
import { displayAlert } from "./alerts";

export const updateSettings = async (data, type) => {
    try{

        const url = type === 'password' ? '/api/v1/auth-users/updatePassword' :
        '/api/v1/users/updateMe';

        const res = await axios({
            method: 'PATCH',
            url,
            data
        })

    if(res.data.status === 'success'){
        displayAlert('success', `${type} successfully updated`);
        window.setTimeout(()=> {
            location.reload(true)
        }, 1500)
    }

    } catch(error){
        displayAlert('error', error.response.data.message);
    }

}