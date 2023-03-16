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
        else { return null; }

    } catch (err) {
        return null;
    }
}

export const setUser = async (username, email, password) => {
    let singup;

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

        if (singup !== null) { return true; } 
        else { return false; }

    } catch (err) {
        return false;
    }
}