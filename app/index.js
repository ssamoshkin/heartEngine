const HeartEngine = require('./classes/heartEngine')
const Brain = require('./classes/brain')

const brain = new Brain();
const heart = new HeartEngine(4);

heart.pumpTo(brain);
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

    console.log(`Состояния: сердце - ${heart.getStatus()}, мозг - ${brain.getState()}, отработала камера ${chamber.getName()}, усталость ${chamber.getStamina()}`)
    console.log(`Кислорода в органе ${Brain.NAME}: ${brain.getOxygenDemand()}`);

}, 2000);