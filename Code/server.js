const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({path:'../Config.env'});
mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true
}).then(()=>console.log("DB CONNECTION IS SUCCESSFUL"));

const port = 3000;
app.listen(port, () => {
    console.log('listening on port 3000')
});