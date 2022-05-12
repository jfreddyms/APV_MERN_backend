import express  from "express";
import dotenv from 'dotenv';
import cors from "cors"
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";


const app = express();

app.use(express.json());

dotenv.config(); 

conectarDB();

//configurando CORS
const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function (origin, callback) {
        if ( dominiosPermitidos.indexOf(origin) !== -1 ) {

            callback(null, true)
        }else {
            callback( new Error('Not permitted by CORS') )
        } 
    }
};

app.use(cors(corsOptions))

app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

const port = process.env.PORT || 4000;

app.listen(port , ()=>{
    console.log(`servidor funcionando en el puerto ${port}`)
})


