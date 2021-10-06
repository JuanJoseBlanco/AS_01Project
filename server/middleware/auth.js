import jwt from "jsonwebtoken";
import { writeLogs } from '../utilities/logs.js';

const secret = 'test';

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {      
      decodedData = jwt.verify(token, secret);

      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;
    }    

    next();
  } catch (error) {
    writeLogs(new Date(), 'Se cerró la sesión debido a que el tiempo ha caducado')
    res.status(401).json({message: 'La sesión ha caducado. Vuelve a iniciar sesión'})
  }
};

export default auth;
