const login = async (email, password) => {

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
        alert('Successfully logged in')
        window.setTimeout(()=> {
            location.assign('/')
        }, 1500)
    }

    } catch(error){
        alert(error.response.data.message)
    }

   
}

document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    login(email, password)
})