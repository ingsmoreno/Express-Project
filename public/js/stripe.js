import axios from "axios";
import { displayAlert } from "./alerts";

export const bookTour = async (tourId, context) => {
    //1. Get checkout session for API
    try{
        const session = await axios({
            method: 'GET',
            url: `/api/v1/bookings/checkout-session/${tourId}`,
        })

        window.location.replace(session.data.session.url);

        // await stripe.redirectToCheckout({
        //     sessionId: session.data.session.id
        // })

    } catch(error){
        context.target.textContent = 'Book tour now!';
       displayAlert('error', error);
    }
}