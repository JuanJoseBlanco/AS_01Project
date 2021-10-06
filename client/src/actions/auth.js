import { AUTH, LOGOUT } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const signin = (formData, router) => async (dispatch) => {
  try {
    const {data} = await api.signIn(formData);

    console.log(data);
    dispatch({ type: AUTH, data });

    router.push('/');
  } catch (error) {
    console.log("Entra en error");
    console.log(error.response.data.message);
    alert(error.response.data.message)
  }
};

export const signup = (formData, router) => async (dispatch) => {
  try {

    const data = await api.signUp(formData);

    dispatch({ type: AUTH, data });

    router.push('/');
  } catch (error) {
    console.log(error);
  }
};

export const logoutUser = (user) => (dispatch) => {
  try {
    let nameUser = user.result.name;
    api.logOut(nameUser);

    dispatch({type: LOGOUT, payload: nameUser})
    alert('La sesión se cerró con éxito')
  } catch (error) {
    console.log(error);
  }
  
}
