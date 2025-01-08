const Danger = require('../models/dangerModel');
const mongoose = require("mongoose");
const createHttpError = require('http-errors')

getByStatus = async (status) => {
    //TODO: authentication
    // if(!user || !user.isModerator) {
    //     throw createHttpError(401);
    // } else {
    return await Danger.find({
        status: status
    })
    .sort('-sendTimestamp')
    .populate('sentBy')
    .exec();
}

exports.getActive = async () => {
    return await getByStatus('approved')
}

exports.getOne = async (dangerId) => {
    try {
        const danger = await Danger.findById(dangerId)
        .populate('sentBy')
        .exec();
        if(!danger) {
            throw createHttpError(404, "Danger not found");
        }
        return danger;
    } catch(e) {
        if(e instanceof mongoose.Error.CastError) {
            throw createHttpError(404, "Danger not found")
        }
        throw e;
    }   
}

exports.getSentByUser = async (user) => {
    return await Danger.find({
        sentBy: user._id
    })
    .sort('-sendTimestamp')
    .populate('sentBy')
    .exec();
}

exports.getWaitingApproval = async () => {
    return await getByStatus('waitingApproval')
}

exports.getRejectedOrExpired = async () => {
    return (await getByStatus('expired')).concat(await getByStatus('rejected'))
}

exports.add = async (form, user) => {
    //TODO: sanitization
    const danger = new Danger({
        category: form.category,
        coordinates: form.coordinates.map(function(x) {
            return parseFloat(x);
        }),
        sendTimestamp: new Date(),
        description: form.description,
        sentBy: user._id,
        status: 'waitingApproval'
    })
    await danger.save();
};

exports.remove = async (dangerId, user) => {
    const danger = await this.getOne(dangerId)
    if(!danger) {throw createHttpError(404, "Danger not found")}
    if(danger.status !== 'waitingApproval') {throw createHttpError(401, "Trying to remove a danger that is not waiting for approval")}
    if(!danger.sentBy._id.equals(user._id)) {throw createHttpError(401, "Trying to remove another user's danger")}
    await Danger.findByIdAndDelete(dangerId)
};

exports.approve = async (dangerId, user, expiration) => {
    if(!user || !user.isModerator) {
        throw createHttpError(401, "Trying to approve danger without being a moderator")
    }
    const danger = await this.getOne(dangerId);
    danger.status = 'approved';
    danger.expiration = expiration;
    await danger.save();
}

exports.updateExpiration = async (dangerId, user, newExpiration) => {
    if(!user || !user.isModerator) {
        throw createHttpError(401, "Trying to modify a danger's expiration without being a moderator")
    }
    const danger = await this.getOne(dangerId);
    danger.expiration = newExpiration
    await danger.save();
}

exports.reject = async (dangerId, user) => {
    if(!user || !user.isModerator) {
        throw createHttpError(401, "Trying to reject danger without being a moderator")
    } 
    const danger = await this.getOne(dangerId);
    danger.status = 'rejected';
    const ttl = new Date();
    ttl.setMonth(ttl.getMonth() + 1)
    danger.expireAt = ttl;
    await danger.save();
}

exports.refreshStatuses = async () => {
    const dangers = await Danger.find({ status: 'approved' }).exec();
    const now = new Date()
    const ttl = new Date()
    ttl.setMonth(ttl.getMonth() + 1)
    for(let i=0; i<dangers.length; i++) {
        if(dangers[i].expiration <= now) {
            await Danger.findByIdAndUpdate(dangers[i]._id, {
                status: 'expired',
                expireAt: ttl
            }).exec();
        }
    }
} 