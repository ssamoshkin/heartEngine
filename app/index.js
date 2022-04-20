const heartEngine = require('./classes/heartEngine')

const heart = new heartEngine(4);

heart.start();

let ticks = 100;
const watcherId = setInterval(() => {
    ticks -= 1;
    if (ticks === 0) {
        heart.stop();
        clearInterval(watcherId);
        console.log(`работа сердца остановлена`)
    }

    const chamber = heart.getLastWorkingChamber();

    console.log(`Состояние: ${heart.getStatus()}, отработала камера ${chamber.getName()}, усталость ${chamber.getStamina()}`)
    console.log(`Текущий пульс ${heart.getPulse()}`)
}, 1000);