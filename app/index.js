const heartEngine = require('./classes/heartEngine')

const heart = new heartEngine(4);

setInterval(() => {
    console.log(`последним отработал ${heart.getLastWorkingChamber().name}`)
}, 1000);