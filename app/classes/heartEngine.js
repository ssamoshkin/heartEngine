var HeartEngine = /** @class */ (function () {
    function HeartEngine(cardiacNumber) {
        this.cardiacNumber = cardiacNumber;
        this.chambers = [];
        for (var i = 0; i < cardiacNumber; i += 1) {
            this.chambers.push(new Chamber());
        }
    }
    HeartEngine.prototype.getLastWorkingChamber = function () {
        return null;
    };
    HeartEngine.prototype.getChamber = function (n) {
        return this.chambers[n];
    };
    return HeartEngine;
}());
var Chamber = /** @class */ (function () {
    function Chamber() {
        this.volume = 100;
    }
    return Chamber;
}());
var NeuralController = /** @class */ (function () {
    function NeuralController(HeartEngine) {
        this.heartEngine = HeartEngine;
    }
    return NeuralController;
}());
module.exports = HeartEngine;
