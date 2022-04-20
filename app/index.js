const heartEngine = require('./classes/heartEngine')

const heart = new heartEngine(4);

setInterval(() => {
    heart.getLastWorkingCardiac()
}, 1000);