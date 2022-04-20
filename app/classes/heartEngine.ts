class HeartEngine {
    private cardiacNumber: number;
    private readonly chambers: Chamber[];
    private chambersIndexIds: Object;
    private lastWorkingCamberId: number;

    constructor(cardiacNumber) {
        this.cardiacNumber = cardiacNumber;
        this.chambers = [];
        for (let i = 0; i < cardiacNumber; i += 1) {
            const chamber = new Chamber();
            this.chambers.push(chamber)
            this.addChamberIndex(chamber)
        }
    }

    addChamberIndex(chamber: Chamber): void {
        this.chambersIndexIds[chamber.getId()] = chamber;
    }

    getLastWorkingChamber(): Chamber {
        return null;
    }

    getChamber(n: number): Chamber {
        return this.chambers[n];
    }

    getChamberById(id: number): Chamber {
        return this.chambersIndexIds[id];
    }

}

class Chamber {
    private volume: number;
    private readonly id: number;

    constructor() {
        this.volume = 100;
        this.id = 0;
    }

    getId() {
        return this.id;
    }
}

class NeuralController {
    private heartEngine: HeartEngine;
    constructor(HeartEngine) {
        this.heartEngine = HeartEngine;
    }
}

module.exports = HeartEngine