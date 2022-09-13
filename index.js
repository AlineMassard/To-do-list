const dotenv = require ('dotenv');
const express = require ('express');
const cors = require('cors');


dotenv.config();

const router = require('./app/router');

const app = express();


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('assets'));
app.use(router);



const PORT = process.env.PORT || 3000;
app.listen (PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
})