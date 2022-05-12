import express from 'express';
import { agregarpaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente} from '../controllers/pacienteControllers.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(checkAuth, agregarpaciente).get(checkAuth,obtenerPacientes); 

router.route('/:id')
    .get(checkAuth, obtenerPaciente)                                                              
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente)

export default router;