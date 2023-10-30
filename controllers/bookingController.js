const Stripe = require('stripe');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');


exports.getCheckoutSession =  catchAsync(async (req, res, next) =>{
    // 1. Request Tour
    const tour = await Tour.findById(req.params.tourId);
    
    // 2. Create session
    const stripe = Stripe(process.env.STRIPE_APIKEY)
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [{ 
            price_data: {
                currency: 'usd',
                unit_amount: tour.price * 100,
                product_data: {
                    name: tour.name,
                    description: tour.summary,
                    images: [`http://localhost:3000/img/tour/${tour.imageCover}`],
                    
                },
            },
            quantity: 1
        }],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    })

    // 3. Send Response

    res.status(201).json({
        status: 'success',
        session
    })
})