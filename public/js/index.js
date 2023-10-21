import { login, logginOut } from "./login";
import { updateSettings } from "./updateSettings"


const loginForm = document.querySelector('.form--login');
const logOutButton = document.querySelector('.nav__el--logout');
const updateForm = document.querySelector('.form-user-data');
const updatePassword = document.querySelector('.form-user-password');

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
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        updateSettings({name, email}, 'data');
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