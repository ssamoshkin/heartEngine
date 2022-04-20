const STANDARD_CHAMBER_STAMINA = 100;
const DEFAULT_STAMINA_RESTORE = 2;

class HeartEngine {
    private chambersCount: number; // количество камер в сердце
    private chambersActiveCount: number; // количество работающих камер в сердце
    private readonly chambers: Chamber[]; // храним массив объектов-камер
    private chambersIndexIds: Object = {}; // доступ к объектам-камер по индексам
    private lastWorkingCamberId: number = 0; // последнеотработавшая камера
    private controller = null;
    private pulseCurrent = 0;
    private pulseMax = 220;
    private pulseMin = 20;
    private textStatus;

    protected requestVolumeOxygen = 0;
    protected entityPumping = null;

    constructor(chambersCount) {
        this.chambersCount = chambersCount;
        this.chambersActiveCount = chambersCount;
        this.chambers = [];
        // генерируем камеры в сердце без возможности управления их параметрами
        for (let i = 0; i < chambersCount; i += 1) {
            const chamber = new Chamber(this);
            this.chambers.push(chamber)
            this.addChamberIndex(chamber)
        }
    }

    start(pulse = 60) {
        this.textStatus = "Запущено";
        this.pulseCurrent = pulse;
        this.controller = new NeuralController(this); // // управление камерами через отдельный контроллер
        this.work();
    }

    stop(): void {
        this.textStatus = "Остановлено"
        clearTimeout(this.controller.processId);
    }

    work(): void {
        if (this.chambersActiveCount === 0) {
            console.log(`Уничтожены все камеры, сердце не может продолжать работу`)
            return this.stop();
        }

        this.controller.tick();
    }

    getStatus(): string {
        return this.textStatus;
    }

    pumpTo(entity: Object): void {
        this.entityPumping = entity;
    }

    transportOxygen(volume): number {
        return this.entityPumping.takeOxygen(volume)
    }

    addChamberIndex(chamber: Chamber): void {
        this.chambersIndexIds[chamber.getId()] = chamber;
    }

    getLastWorkingChamber(): Chamber {
        if (this.lastWorkingCamberId === 0) throw ('Сердце еще не было создано или запущено');
        return this.getChamberById(this.lastWorkingCamberId);
    }

    setLastWorkingChamber(id: number): void {
        this.lastWorkingCamberId = this.getChamberById(id).getId();
    }

    getChambers(): Chamber[] {
        return this.chambers;
    }

    getChamberById(id: number): Chamber {
        return this.chambersIndexIds[id];
    }

    getActiveChamber(): Chamber {
        return this.chambers[0];
    }

    decreaseActiveChambers(): number {
        return this.chambersActiveCount -= 1;
    }

    increasePulse(value) {
        this.pulseCurrent += value;
    }

    decreasePulse(value) {
        this.pulseCurrent -= value;
    }

    getPulse(): number {
        return this.pulseCurrent;
    }

}

class Chamber {
    private readonly heart: HeartEngine;
    private volume: number = Math.floor(Math.random() * 100);
    private readonly id: number;
    private stamina = STANDARD_CHAMBER_STAMINA;
    private staminaMax = 100;
    protected name: string = 'Камера №';
    private destroyed = false;
    private readonly intervalId = null;

    constructor(heart: HeartEngine) {
        this.heart = heart;
        this.volume = 100;
        this.id = heart.getChambers().length + 1;
        this.name += this.id;

        this.intervalId = setInterval(() => {
            this.restoreStamina(DEFAULT_STAMINA_RESTORE);
        }, 100);

    }

    getId() {
        return this.id;
    }

    reduce(pushPower: number = 100) {
        this.stamina -= pushPower / 10;

        if (this.stamina < 0) {
            this.destroy();
            console.log(`Уничтожена ${this.getName()}`)
            return 0; // камера не смогла ничего не прокачать
        }

        console.log(`сокращение камеры ${this.getName()}, стамина ${this.getStamina()}`)

        this.heart.setLastWorkingChamber(this.id);
        return pushPower / 2; // возвращаем прокаченный объем, о котором знает камера
    }

    getStamina(): number {
        return this.stamina;
    }

    restoreStamina(stamina: number): number {
        this.stamina += stamina;
        if (this.stamina > 100) {
            this.stamina = this.staminaMax;
        }

        return this.stamina;
    }

    destroy(): void {
        this.stamina = 0;
        this.destroyed = true;
        this.heart.decreaseActiveChambers();
        clearInterval(this.intervalId);
    }

    getDestroyed(): boolean {
        return this.destroyed;
    }

    getName(): string {
        return this.name;
    }
}

class NeuralController {
    // управляет камерами, балансирует нагрузку
    private heartEngine: HeartEngine;
    private processId = null;

    constructor(HeartEngine) {
        this.heartEngine = HeartEngine;
    }

    getFreshChamber(): Chamber {
        const chambers = this.heartEngine.getChambers();

        let maxStamina = chambers[chambers.length - 1].getStamina();
        let chamberFreshId = chambers[chambers.length - 1].getId();



        chambers.forEach((chamber: Chamber) => {
            if (chamber.getDestroyed() === false) {
                const stamina = chamber.getStamina();
                if (stamina > maxStamina) {
                    maxStamina = stamina;
                    chamberFreshId = chamber.getId()
                }
            }
        });

        if (!chamberFreshId) {
            throw ('Не удалось вычислить менее уставшуюю камеру');
        }

        return this.heartEngine.getChamberById(chamberFreshId);
    }

    tick() {
        const freshCamber = this.getFreshChamber();

        const pushedVolume = freshCamber.reduce();

        if (pushedVolume === 0) {
            console.log(`Внимание! Камера ничего не прокачала!`);
        }

        const oxygenDemand = this.heartEngine.transportOxygen(pushedVolume); // после отдачи кислорода органу, узнаем его дальнейшую потребность в нем

        if (oxygenDemand <= 0) {
            this.heartEngine.decreasePulse(10);
        } else if (oxygenDemand > 100) {
            this.heartEngine.increasePulse(10);
        }

        this.processId = setTimeout(() => {
            this.heartEngine.work();
        }, 60 / this.heartEngine.getPulse() * 1000);

        return this.heartEngine.getActiveChamber();
    }
}

module.exports = HeartEngine