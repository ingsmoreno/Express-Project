import { login, logginOut } from "./login";
import { updateData } from "./updateSettings"


const loginForm = document.querySelector('.form--login');
const logOutButton = document.querySelector('.nav__el--logout');
const updateForm = document.querySelector('.form-user-data');

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
        updateData(name, email);
    })
}