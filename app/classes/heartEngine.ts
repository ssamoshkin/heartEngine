class HeartEngine {
    private chambersCount: number; // количество камер в сердце
    private readonly chambers: Chamber[]; // храним массив объектов-камер
    private chambersIndexIds: Object; // доступ к объектам-камер по индексам
    private lastWorkingCamberId: number = 0; // последнеотработавшая камера
    private controller = null;
    private pulseCurrent = 0;
    private pulseMax = 220;
    private pulseMin = 20;

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

    start() {
        this.controller = new NeuralController(this); // // управление камерами через отдельный контроллер
        this.work();
    }

    stop() {
        clearTimeout(this.controller.processId);
    }

    work() {
        this.controller.tick();
    }

    addChamberIndex(chamber: Chamber): void {
        this.chambersIndexIds[chamber.getId()] = chamber;
    }

    getLastWorkingChamber(): Chamber {
        if (this.lastWorkingCamberId === 0) throw ('Сердце еще не было создано или запущено');
        return this.getChamberById(this.lastWorkingCamberId);
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
    private volume: number = Math.floor(Math.random() * 100);
    private readonly id: number;
    private stamina = 100;
    protected name: string = 'Камера №';

    constructor(heart: HeartEngine) {
        this.volume = 100;
        this.id = heart.getChambers().length + 1;
        this.name += this.id;
    }

    getId() {
        return this.id;
    }

    push(pushPower: number = 100) {
        this.stamina -= pushPower / 10;
    }
}

class NeuralController {
    // управляет камерами, балансирует нагрузку
    private heartEngine: HeartEngine;
    private processId = null;

    constructor(HeartEngine) {
        this.heartEngine = HeartEngine;
    }

    tick() {
        const chambers = this.heartEngine.getChambers();

        // calculate next camber tick

        this.processId = setTimeout(() => {
            this.heartEngine.start();
        }, this.heartEngine.getPulse());

        return this.heartEngine.getActiveChamber();
    }
}

module.exports = HeartEngine