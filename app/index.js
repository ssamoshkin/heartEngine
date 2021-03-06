const HeartEngine = require('./classes/heartEngine')
const Brain = require('./classes/brain')
const config = require('./config')

const brain = new Brain();
const heart = new HeartEngine(config.default_heart_chamber);

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
        process.kill(process.pid, 'SIGTERM')
    }

}, 2000);