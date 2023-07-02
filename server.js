const dotenv = require('dotenv')
dotenv.config({path: './config.env'});
const app = require('./app');

const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

app.listen(PORT, HOST, () => {
    console.log('listening ' + PORT) 
})