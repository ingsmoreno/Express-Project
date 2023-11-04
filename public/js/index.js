import { login, logginOut } from "./login";
import { bookTour } from "./stripe";
import { updateSettings } from "./updateSettings";

const loginForm = document.querySelector('.form--login');
const logOutButton = document.querySelector('.nav__el--logout');
const updateForm = document.querySelector('.form-user-data');
const updatePassword = document.querySelector('.form-user-password');
const bookingBtn = document.getElementById('book-tour');

if(loginForm){
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        login(email, password)
    })
}  

if(logOutButton) logOutButton.addEventListener('click', logginOut);

if(updateForm) {
    updateForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('email', document.getElementById('email').value);
        form.append('name', document.getElementById('name').value);
        form.append('photo', document.getElementById('photo').files[0])
        updateSettings(form, 'data');
    })
}

if(updatePassword) {
    updatePassword.addEventListener('submit', async e => {
        e.preventDefault();
        document.querySelector('.btn--save-password').innerHTML = "Updating...";
        
        const oldPassword = document.getElementById('password-current').value;
        const newPassword = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;

        await updateSettings ({oldPassword, newPassword, passwordConfirm}, 'password');
    })
}

if(bookingBtn){
    bookingBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...';

        const {tourId} = e.target.dataset;
        bookTour(tourId, e)
    });
}