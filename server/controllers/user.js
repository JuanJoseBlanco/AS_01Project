import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModal from "../models/user.js";

const secret = 'test';

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "El usuario no existe" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Credenciales invalidas" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
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

      res.status(201).json({ result, token });
    } else {
      return res.json({ statusCode: '001', message: "La contraseña no cumple con los requisitos requeridos" })
    }
  } catch (error) {
    res.status(500).json({ message: "Algo salió mal" });
    console.log(error);
  }
}


