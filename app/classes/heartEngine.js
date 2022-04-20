var HeartEngine = /** @class */ (function () {
    function HeartEngine(chambersCount) {
        this.lastWorkingCamberId = 0; // последнеотработавшая камера
        this.controller = null;
        this.pulseCurrent = 0;
        this.pulseMax = 220;
        this.pulseMin = 20;
        this.chambersCount = chambersCount;
        this.chambers = [];
        // генерируем камеры в сердце без возможности управления их параметрами
        for (var i = 0; i < chambersCount; i += 1) {
            var chamber = new Chamber(this);
            this.chambers.push(chamber);
            this.addChamberIndex(chamber);
        }
    }
    HeartEngine.prototype.start = function () {
        this.controller = new NeuralController(this); // // управление камерами через отдельный контроллер
        this.work();
    };
    HeartEngine.prototype.stop = function () {
        clearTimeout(this.controller.processId);
    };
    HeartEngine.prototype.work = function () {
        this.controller.tick();
    };
    HeartEngine.prototype.addChamberIndex = function (chamber) {
        this.chambersIndexIds[chamber.getId()] = chamber;
    };
    HeartEngine.prototype.getLastWorkingChamber = function () {
        if (this.lastWorkingCamberId === 0)
            throw ('Сердце еще не было создано или запущено');
        return this.getChamberById(this.lastWorkingCamberId);
    };
    HeartEngine.prototype.setLastWorkingChamber = function (id) {
        this.lastWorkingCamberId = this.getChamberById(id).getId();
    };
    HeartEngine.prototype.getChambers = function () {
        return this.chambers;
    };
    HeartEngine.prototype.getChamberById = function (id) {
        return this.chambersIndexIds[id];
    };
    HeartEngine.prototype.getActiveChamber = function () {
        return this.chambers[0];
    };
    HeartEngine.prototype.getPulse = function () {
        return this.pulseCurrent;
    };
    return HeartEngine;
}());
var Chamber = /** @class */ (function () {
    function Chamber(heart) {
        this.volume = Math.floor(Math.random() * 100);
        this.stamina = 100;
        this.name = 'Камера №';
        this.heart = heart;
        this.volume = 100;
        this.id = heart.getChambers().length + 1;
        this.name += this.id;
    }
    Chamber.prototype.getId = function () {
        return this.id;
    };
    Chamber.prototype.push = function (pushPower) {
        if (pushPower === void 0) { pushPower = 100; }
        this.stamina -= pushPower / 10;
        this.heart.setLastWorkingChamber(this.id);
    };
    return Chamber;
}());
var NeuralController = /** @class */ (function () {
    function NeuralController(HeartEngine) {
        this.processId = null;
        this.heartEngine = HeartEngine;
    }
    NeuralController.prototype.tick = function () {
        var _this = this;
        var chambers = this.heartEngine.getChambers();
        // calculate next camber tick
        this.processId = setTimeout(function () {
            _this.heartEngine.work();
        }, this.heartEngine.getPulse());
        chambers[0].push();
        return this.heartEngine.getActiveChamber();
    };
    return NeuralController;
}());
module.exports = HeartEngine;
