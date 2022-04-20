class HeartEngine {
    constructor(cardiacNumber) {
        this.cardiacNumber = cardiacNumber;
        this.cardiacs = [];
        for (let i = 0; i < cardiacNumber; i += 1) {
            this.cardiacs.push(new Cardiac())
        }
    }
    getLastWorkingCardiac() {
        return null;
    }

}

class Cardiac {
    constructor() {
        this.volume = 100;
    }
}

class NeuralController {

}

module.exports = HeartEngine