const HeartEngine = require('./classes/heartEngine')
const Brain = require('./classes/brain')

const brain = new Brain();
const heart = new HeartEngine(4);

heart.pumpTo(brain);
heart.start();

const watcherId = setInterval(() => {
    const chamber = heart.getLastWorkingChamber();

    console.log(`Состояния: пульс - ${heart.getPulse()}, отработала камера ${chamber.getName()}, усталость ${chamber.getStamina()}`)

    if (brain.getState() === "alive") {
        console.log(`Кислорода в органе ${Brain.NAME}: ${brain.getOxygenStock()}`);
    } else {
        console.log(`Мозг погиб, останавливаем работу сердца..`)
        heart.stop()
        clearInterval(watcherId);
    }

}, 2000);