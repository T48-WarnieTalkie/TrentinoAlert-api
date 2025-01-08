module.exports.categoryConverter = (category) => {
    switch (category) {
        case 'animale-pericoloso': return "Animale pericoloso";
        case 'calamita-ambientale': return "Calamità ambientale";
        case 'sentiero-inagibile': return "Sentiero inagibile";
        case 'altro': return "Pericolo";
        default: return "err";
    }
}

module.exports.timestampToDate = (timestamp) => {
    return timestamp.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + "/" 
    + (timestamp.getMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})+ "/" 
    + timestamp.getFullYear().toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping:false})
}

module.exports.timestampToTime = (timestamp) => {
    return timestamp.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ":" + 
    timestamp.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ":" + 
    timestamp.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
}

module.exports.timestampToTimeAgo = (timestamp) => {
    const differenceSeconds = Math.abs(new Date() - timestamp)/1000;
    if(differenceSeconds == 1) {
        return "1 secondo"
    } else if(differenceSeconds < 60) {
        return differenceSeconds.toFixed() + " secondi"
    } else if(differenceSeconds < 60*2) {
        return "1 minuto"
    } else if(differenceSeconds < 60*60) {
        return (differenceSeconds/60).toFixed() + " minuti"
    } else if(differenceSeconds < 60*60*2) {
        return "circa 1 ora"
    } else if(differenceSeconds < 60*60*24) {
        return "circa " + (differenceSeconds/(60*60)).toFixed() + " ore"
    } else if(differenceSeconds < 60*60*24*2) {
        return "1 giorno"
    } else {
        return (differenceSeconds/(60*60*24)).toFixed() + " giorni"
    }
}

module.exports.UTCToLocaleTimestamp = (date) => {
    const localDate = new Date(date);
    localDate.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    return localDate.toISOString().slice(0, -8);
}