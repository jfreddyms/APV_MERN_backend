import Veterinario from "../models/Veterinario.js";
import generarJWT from '../helpers/generarJWT.js'
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res)=> {
   const {email, nombre} = req.body;
   const existeUsuario = await Veterinario.findOne({email});
   
   if (existeUsuario) {
       const error = new Error('User already registered');
       return res.status(400).json({msg: error.message});
    };

    try {
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        emailRegistro({
            nombre, 
            email,
            token: veterinarioGuardado.token
        });

        res.json(veterinarioGuardado);
        
    } catch (error) {
        console.log(error)
    };
};

const perfil = (req, res)=> {

    const  { veterinario } = req;
    res.json( veterinario )
};

const actualizarPerfil = async (req, res) => {
    const { id } = req.params;
    const veterinario = await Veterinario.findById(id);

    if (!veterinario) {
        const error = new Error('Someting Wrong');
        return res.status(400).json({msg: error.message});   
    };

    const { email } = req.body
    if (veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({email})
        if (existeEmail) { 
            const error = new Error(`${email} is already taken`);
            return res.status(400).json({msg: error.message})
        };
    };

    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.telefono = req.body.telefono;
        veterinario.web = req.body.web;

        const veterinarioActualizado = await veterinario.save();

        res.json(veterinarioActualizado);
        
    } catch (error) {
        console.log(error) 
    };
};

const confirmar = async (req, res)=> {

    const { token } = req.params;
    const confirmarUsuario = await Veterinario.findOne({token});

    if (!confirmarUsuario) {
        const error = new Error("invalid token");
        return res.status(404).json({msg: error.message});
    };

    try {
        confirmarUsuario.token = null;
        confirmarUsuario.confirmado = true;
        await confirmarUsuario.save();
        res.json({msg: 'User confirmed'});
    } catch (error) {
        console.log(error)
    };
};

const autenticar = async (req, res) => {

    const { email, password} = req.body;
    const usuario = await Veterinario.findOne({email});

    if (!usuario) {
        const error = new Error(`User ${email} does nor exist`);
        return res.status(404).json({msg: error.message});
    };

    if (!usuario.confirmado) {
        const error = new Error(`Your User ${email} does not confirmed`);
        return res.status(403).json({msg: error.message});
    };

    if ( await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        })

    } else {
        const error = new Error('Incorrect password');
        return res.status(403).json({msg: error.message});
    };
};

const olvidePassword = async (req, res) =>{
    const { email } = req.body;
    const existeVeterinario = await Veterinario.findOne({email});

    if (!existeVeterinario) {
        const error = new Error(`Your ${email} does not exist`);
        res.status(400).json({ msg: error.message});
    };
 
    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save(); 
        
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token,
        });
        
        res.json({msg: 'We have sent an email with the instructions'});
    } catch (error) {
        console.log(error)
    };
};

const comprobarToken = async (req, res) => {
   const { token } = req.params; 
   const tokenValido = await Veterinario.findOne({token});

   if (tokenValido) {
        res.json({msg: 'Change your New Password'});
   } else {
    const error = new Error('Something wrong in the link');
    res.status(400).json({msg: error.message});
   };
};

const nuevoPassword = async (req, res) => {
   
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({token});

    if (!veterinario) {
        const error = new Error('Something wrong in the link');
        return res.status(400).json({ msg: error.message});
    };

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        return res.json({msg: 'Password changed successfully'});

    } catch (error) {
        console.log(error)
    };
}

const actualizarPassword = async (req, res) => {
   
    const { id } = req.veterinario;
    const { pwd_nuevo, pwd_actual } = req.body;

    const veterinario = await Veterinario.findById(id);
    if (!veterinario) {
        const error = new Error('Something wrong');
        return res.status(400).json({ msg: error.message});
    };

    if( await veterinario.comprobarPassword(pwd_actual)){
        veterinario.password = pwd_nuevo; 
        await veterinario.save(); 

        return res.json({ msg: 'the password updated successfully'} );
    }else{
        const error = new Error('The Current Password is Incorrect');
        return res.status(400).json({ msg: error.message});
    };
};


export  {
    registrar,
    perfil,
    confirmar,
    autenticar, 
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
};