require('express');

const User = require('../models/userModel');
const Session = require('../models/sessionModel');
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');

exports.login = async (form, res) => {
    const user = await User.findOne({
        emailAdress: form.emailAdress
    }).exec();
    if(user == null) {
        throw createHttpError(401, "Mail doesen't exist");
    }
    if(await bcrypt.compare(form.password, user.password)) {
        const sessionId = crypto.randomUUID();
        res.set('Set-Cookie', "session=" + sessionId);
        const session = new Session({
            sessionId: sessionId,
            user: user._id
        })
        await session.save();
    } else {
        throw createHttpError(401, "Password is wrong");
    }
};

exports.registration = async (form) => {
    const u1 = await User.findOne({
        emailAdress: form.emailAdress
    }).exec();
    const u2 = await User.findOne({
        cellphoneNumber: form.cellphoneNumber
    }).exec();
    console.log(u1);
    if(u1 != null || u2 != null) {
        throw createHttpError(409, "An account with the same email adress or cellphone number already exists")
    }
    const hashedPassword = await bcrypt.hash(form.password, 10);
    var newUser = new User({
        name: form.name,
        surname: form.surname,
        cellphoneNumber: form.cellphoneNumber,
        emailAdress: form.emailAdress,
        password: hashedPassword,
        isModerator: false
    })
    await newUser.save();
};

// exports.get = async (userId) => {
//     try {
//         const user = await User.findById(userId)
//         .populate('sentBy')
//         .exec();
//         if(!user) {
//             throw createHttpError(404, "User not found");
//         }
//         return user;
//     } catch(e) {
//         if(e instanceof mongoose.Error.CastError) {
//             throw createHttpError(404, "User not found")
//         }
//         throw e;
//     }    
// }

exports.updateInfo = async (form, user) => {
    console.log(form);
    user.name = form.name;
    user.surname = form.surname;
    user.cellphoneNumber = form.cellphoneNumber;
    user.emailAdress = form.emailAdress;
    await user.save();
}

exports.findSession = async (req) => {
    const sessionId = req.headers.cookie?.split('=')[1];
    const session = await Session.findOne( {sessionId: sessionId} )
    .populate('user')
    .exec();
    if(session == null) {
        throw createHttpError(404, "Session cookie not found")
    } else {
        return session;
    }
}

exports.logout = async (req, res) => {
    const sessionId = req.headers.cookie?.split('=')[1];
    await Session.deleteMany( {sessionId: sessionId} );
    res.clearCookie("session");
}

