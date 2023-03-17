import { User } from "./sequelize.js";

export const getUser = async (login, password) => {
    let loginWithUsername, loginWithEmail;

    try {
        loginWithUsername = await User.findOne
        (
            { where: 
                { 
                    username: login,
                    password: password
                } 
            }
        );

        loginWithEmail = await User.findOne
        (
            { where: 
                { 
                    email: login,
                    password: password
                } 
            }
        );

        if (loginWithUsername !== null) { return loginWithUsername; } 
        else if (loginWithEmail !== null) { return loginWithEmail; } 
        else { 
            return {"error": "No existe ningún usuario con ese nombre de usuario o email."};
        } 

    } catch (err) {
        return {"error": "No se han enviado los parámetros"};
    }
}

export const createUser = async (username, email, password) => {
    let singup;

    // Falta poner restricciones al usuario

    try {
        singup = await User.create
        (
            {
                username: username,
                email: email,
                password: password,
                role: 'user'
            }
        );

        if (singup !== null) { return {"exito": "Se ha registrado con éxito"}; } 

    } catch (err) {
        return {"error": "No se han enviado los parámetros"};
    }
}