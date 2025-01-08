const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Danger = require('./models/dangerModel');
const User = require("./models/userModel")
const mongoDB = 'mongodb+srv://admin:admin@trentinoalert.yxh7w.mongodb.net/?retryWrites=true&w=majority&appName=TrentinoAlert';

main().catch((err) => console.log(err));

async function main() {
    console.log('About to connect');
    await mongoose.connect(mongoDB);
    console.log('Should be connected?');
    const admin = new User({
        name: "Giorgia",
        surname: "Meloni",
        emailAdress: "giorgia.meloni@gmail.com",
        cellphoneNumber: "0000000000",
        password: "$2b$10$3n2ndwMt2s4TgmHuwtxEpuWbyGLkcd3fMNUu6UvSYgXCbs8AUZGLS",
        isModerator: true
    })
    const danger = new Danger({
        category: 'animale-pericoloso',
        coordinates: [46.06618909294647, 11.154212951660156],
        sendTimestamp: new Date(),
        description: "Ho visto un lupo in centro a povo!",
        sentBy: admin,
        status: 'waitingApproval'
    })
    await admin.save();
    console.log("saved admin");
    await danger.save();
    console.log('Saved danger1');
    mongoose.connection.close();
}