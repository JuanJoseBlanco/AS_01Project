import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { writeLogs } from "../utilities/logs.js";

import UserModal from "../models/user.js";

const secret = 'test';



export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {

    const oldUser = await UserModal.findOne({ email });
    console.log(oldUser);

    if (!oldUser){
      writeLogs(new Date(), 'Se está intentando ingresar al sistema con un correo no registrado en la base de datos')
      return res.status(404).json({ message: "El usuario no existe. Intenta con un usuario existente o regístrate en el sistema" });
    } 

    if(oldUser.attempts >= 5) {
      return res.status(401).json({message: `El usuario ${oldUser.email} se encuentra bloqueado debido a muchos intentos fallidos` })
    }else {
      const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

      if (!isPasswordCorrect){
        writeLogs(new Date(), 'El usuario ' +email +' está intentando ingresar al sistema con credenciales inválidas')

        await UserModal.findOneAndUpdate({_id: oldUser._id}, {$inc: {attempts: 1}});


        return res.status(400).json({ message: "Credenciales invalidas. Inténtalo de nuevo" });
      }

      const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1m" });
      writeLogs(new Date(), `El usuario ${oldUser.name} ha iniciado sesión en el sistema`);
      res.status(200).json({ result: oldUser, token });
    }
    
  } catch (err) {
    writeLogs(new Date(), 'Algo salió mal en el inicio de sesión')
    res.status(500).json({ message: "Algo salió mal" });
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  try {
    if (regex.test(req.body.password)) {
      const oldUser = await UserModal.findOne({ email });

      if (oldUser) return res.status(400).json({ message: "Ya existe el usuario" });

      const hashedPassword = await bcrypt.hash(password, 12);

      const result = await UserModal.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
      const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: "1h" });

      writeLogs(new Date(), `El usuario ${firstName} ${lastName} se ha registrado en el sistema`);
      res.status(201).json({ result, token });
    } else {
      return res.json({ statusCode: '001', message: "La contraseña no cumple con los requisitos requeridos" })
    }
  } catch (error) {
    res.status(500).json({ message: "Algo salió mal" });
    console.log(error);
  }
}

export const logout = (req, res) => {
  writeLogs(new Date(), `El usuario ${req.params.user} ha cerrado sesión`);
  res.status(201)
}
