import axios from "axios";
import { displayAlert } from "./alerts";

export const updateData = async (name, email) => {
    try{
        const res = await axios({
            method: 'PATCH',
            url: 'http://localhost:3000/api/v1/users/updateMe',
            data: {
                name,
                email
            }
        })
    if(res.data.status === 'success'){
        displayAlert('success', 'Successfully updated');
        location.reload(true)
    }

    } catch(error){
        displayAlert('error', error.response.data.message);
    }

}