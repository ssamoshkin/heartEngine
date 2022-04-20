const STANDARD_CHAMBER_STAMINA = 100;

class HeartEngine {
    private chambersCount: number; // количество камер в сердце
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

    stop() {
        this.textStatus = "Остановлено"
        clearTimeout(this.controller.processId);
    }

    work() {
        this.controller.tick();
    }

    getStatus(): string {
        return this.textStatus;
    }

    pumpTo(entity: Object) {
        this.entityPumping = entity;
    }

    transportOxygen(volume): void {
        this.entityPumping.takeOxygen(volume)
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

    getPulse(): number {
        return this.pulseCurrent;
    }

}

class Chamber {
    private readonly heart: HeartEngine;
    private volume: number = Math.floor(Math.random() * 100);
    private readonly id: number;
    private stamina = STANDARD_CHAMBER_STAMINA;
    protected name: string = 'Камера №';

    constructor(heart: HeartEngine) {
        this.heart = heart;
        this.volume = 100;
        this.id = heart.getChambers().length + 1;
        this.name += this.id;
    }

    getId() {
        return this.id;
    }

    reduce(pushPower: number = 100) {
        this.stamina -= pushPower / 10;
        this.heart.transportOxygen(pushPower);

        console.log(`сокращение камеры ${this.getName()}, стамина ${this.getStamina()}`)

        if (this.stamina < 0) {
            this.heart.stop();
            console.log(`Остановка сердца, так как переутомилась ${this.getName()}`)
        }

        this.heart.setLastWorkingChamber(this.id);
    }

    getStamina(): number {
        return this.stamina;
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

    getFreshCamber(): Chamber {
        const chambers = this.heartEngine.getChambers();

        let maxStamina = chambers[chambers.length - 1].getStamina();
        let chamberFreshId = chambers[chambers.length - 1].getId();

        chambers.forEach((chamber: Chamber) => {
            const stamina = chamber.getStamina();
            if (stamina > maxStamina) {
                maxStamina = stamina;
                chamberFreshId = chamber.getId()
            }
        });

        if (!chamberFreshId) {
            throw ('Не удалось вычислить менее уставшуюю камеру');
        }

        return this.heartEngine.getChamberById(chamberFreshId);
    }

    tick() {
        const freshCamber = this.getFreshCamber();

        this.processId = setTimeout(() => {
            this.heartEngine.work();
        }, 1200);

        freshCamber.reduce();

        return this.heartEngine.getActiveChamber();
    }
}

module.exports = HeartEngine