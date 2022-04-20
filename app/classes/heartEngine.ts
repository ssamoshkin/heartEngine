class HeartEngine {
    private cardiacNumber: number;
    private readonly chambers: Chamber[];

    constructor(cardiacNumber) {
        this.cardiacNumber = cardiacNumber;
        this.chambers = [];
        for (let i = 0; i < cardiacNumber; i += 1) {
            this.chambers.push(new Chamber())
        }
    }
    getLastWorkingChamber(): Chamber {
        return null;
    }

    getChamber(n: number): Chamber {
        return this.chambers[n];
    }

}

class Chamber {
    private volume: number;
    constructor() {
        this.volume = 100;
    }
}

class NeuralController {
    private heartEngine: HeartEngine;
    constructor(HeartEngine) {
        this.heartEngine = HeartEngine;
    }
}

module.exports = HeartEngine