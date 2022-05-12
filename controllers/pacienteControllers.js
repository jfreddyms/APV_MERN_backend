import expres from 'express';
import Paciente from '../models/Pacientes.js'

const agregarpaciente = async  (req, res) => {

    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;

    try {
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
        
    } catch (error) {
        return res.json({msg: 'Something wrong'})
    }
};

const obtenerPacientes = async (req, res) => {
   
    const paciente = await Paciente.find().where("veterinario").equals(req.veterinario);
    res.json(paciente);
};

const obtenerPaciente = async (req, res) => {
    
    const { id } = req.params;
    const paciente = await Paciente.findById(id)

    if (!paciente) {
        return res.status(404).json({msg: 'Patient does not exist'})
    };

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg: 'invalid action'})
    };

    res.json(paciente)
};

const actualizarPaciente = async (req, res) => {
    
    const { id } = req.params;
    const paciente = await Paciente.findById(id)

    if (!paciente) {
        return res.status(404).json({msg: 'Patient does not exist'})
    };

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg: 'invalid action'})
    };

    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario ;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save()
        res.json(pacienteActualizado)
    } catch (error) {
        console.log(error)
    }; 
};

const eliminarPaciente = async (req, res) => {

    const { id } = req.params;
    const paciente = await Paciente.findById(id)

    if (!paciente) {
        return res.status(404).json({msg: 'Patient does not exist'})
    };

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg: 'invalid action'})
    };

    try {
        await paciente.deleteOne() 
        res.json({msg: 'Patient successfully removed'})
    } catch (error) {
        console.log(error)
    };
};


export {
    agregarpaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
};