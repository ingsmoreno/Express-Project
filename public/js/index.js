import { login, logginOut } from "./login";


const loginForm = document.querySelector('.form--login');
const logOutButton = document.querySelector('.nav__el--logout');

if(loginForm){
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        login(email, password)
    })
}  

if(logOutButton) logOutButton.addEventListener('click', logginOut);