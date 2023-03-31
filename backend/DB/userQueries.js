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
            return {"error": "Los datos no son válidos. No exise este usuario."};
        } 

    } catch (err) {
        return {"error": "No se han enviado los parámetros"};
    }
}

export const createUser = async (username, email, password) => {
    let singup;
    
        try {
            if ((!String(email).toLowerCase().match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/))) {
                return {"error": "El email no es válido."};
            } else if (!String(username).match(/^[a-zA-Z0-9]+$/)) {
                return {"error": "El username no es válido."};
            }
            else {
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
            }
        } catch (err) {
            return {"error": "No se han enviado los parámetros necesarios."};
        }
}

export const setUser = async (login, username, email, password) => {
    let singupUsername, sigupEmail;

    if ((!String(email).toLowerCase().match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/))) {
        return {"error": "El email no es válido."};
    } else if (!String(username).match(/^[a-zA-Z0-9]+$/)) {
        return {"error": "El username no es válido."};
    }
    else {
        try {
            singupUsername = await User.update
            (
                {
                    username: username,
                    email: email,
                    password: password
                },
                { where : 
                    {
                        username: login
                    }
                }
            );

            sigupEmail = await User.update
            (
                {
                    username: username,
                    email: email,
                    password: password
                },
                { where : 
                    {
                        email: login
                    }
                }
            );

            if (singupUsername !== null || sigupEmail !== null) { return {"exito": "Se ha actualizado con éxito"}; } 

        } catch (err) {
            return {"error": "No se han enviado los parámetros necesarios."};
        }
    }
}

export const dropUser = async (login) => {
    let dropByUsername, dropByEmail;

    try {
        dropByUsername = await User.destroy
        (
            { where : 
                {
                    username: login
                }
            }
        );

        dropByEmail = await User.destroy
        (
            { where : 
                {
                    email: login
                }
            }
        );

        if (dropByUsername !== null || dropByEmail !== null) { return {"exito": "Se ha borrado con éxito"}; } 

    } catch (err) {
        return {"error": "No se han enviado los parámetros necesarios."};
    }
}
