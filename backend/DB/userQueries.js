import { User } from "./sequelize.js";

export const createAdmin = async () => {
    await User.create({ username: "admin", email: "admin@gmail.com", password: "admin", role: "admin" });
}

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
        return {"error": "Los parámetros no son válidos o suficientes."};
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
            return {"error": "Los parámetros no son válidos o suficientes."};
        }
}

export const setUser = async (login, password, username, email, newPassword) => {
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
                    password: newPassword
                },
                { where : 
                    {
                        username: login,
                        password: password
                    }
                }
            );

            sigupEmail = await User.update
            (
                {
                    username: username,
                    email: email,
                    password: newPassword
                },
                { where : 
                    {
                        email: login,
                        password: password
                    }
                }
            );

            if (singupUsername !== null || sigupEmail !== null) { return {"exito": "El usuario se ha actualizado con éxito"}; } 

        } catch (err) {
            return {"error": "Los parámetros no son válidos o suficientes."};
        }
    }
}

export const dropUser = async (login, password) => {
    let dropByUsername, dropByEmail;

    try {
        dropByUsername = await User.destroy
        (
            { where : 
                {
                    username: login,
                    password: password
                }
            }
        );

        dropByEmail = await User.destroy
        (
            { where : 
                {
                    email: login,
                    password: password
                }
            }
        );

        if (dropByUsername !== null || dropByEmail !== null) { return {"exito": "Se ha borrado con éxito"}; } 

    } catch (err) {
        return {"error": "Los parámetros no son válidos o suficientes."};
    }
}
