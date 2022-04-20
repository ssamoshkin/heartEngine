var STANDARD_CHAMBER_STAMINA = 100;
var HeartEngine = /** @class */ (function () {
    function HeartEngine(chambersCount) {
        this.chambersIndexIds = {}; // доступ к объектам-камер по индексам
        this.lastWorkingCamberId = 0; // последнеотработавшая камера
        this.controller = null;
        this.pulseCurrent = 0;
        this.pulseMax = 220;
        this.pulseMin = 20;
        this.requestVolumeOxygen = 0;
        this.entityPumping = null;
        this.chambersCount = chambersCount;
        this.chambersActiveCount = chambersCount;
        this.chambers = [];
        // генерируем камеры в сердце без возможности управления их параметрами
        for (var i = 0; i < chambersCount; i += 1) {
            var chamber = new Chamber(this);
            this.chambers.push(chamber);
            this.addChamberIndex(chamber);
        }
    }
    HeartEngine.prototype.start = function (pulse) {
        if (pulse === void 0) { pulse = 60; }
        this.textStatus = "Запущено";
        this.pulseCurrent = pulse;
        this.controller = new NeuralController(this); // // управление камерами через отдельный контроллер
        this.work();
    };
    HeartEngine.prototype.stop = function () {
        this.textStatus = "Остановлено";
        clearTimeout(this.controller.processId);
    };
    HeartEngine.prototype.work = function () {
        if (this.chambersActiveCount === 0) {
            console.log("\u0423\u043D\u0438\u0447\u0442\u043E\u0436\u0435\u043D\u044B \u0432\u0441\u0435 \u043A\u0430\u043C\u0435\u0440\u044B, \u0441\u0435\u0440\u0434\u0446\u0435 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0442\u044C \u0440\u0430\u0431\u043E\u0442\u0443");
            return this.stop();
        }
        this.controller.tick();
    };
    HeartEngine.prototype.getStatus = function () {
        return this.textStatus;
    };
    HeartEngine.prototype.pumpTo = function (entity) {
        this.entityPumping = entity;
    };
    HeartEngine.prototype.transportOxygen = function (volume) {
        this.entityPumping.takeOxygen(volume);
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
    HeartEngine.prototype.decreaseActiveChambers = function () {
        return this.chambersActiveCount -= 1;
    };
    HeartEngine.prototype.getPulse = function () {
        return this.pulseCurrent;
    };
    return HeartEngine;
}());
var Chamber = /** @class */ (function () {
    function Chamber(heart) {
        this.volume = Math.floor(Math.random() * 100);
        this.stamina = STANDARD_CHAMBER_STAMINA;
        this.name = 'Камера №';
        this.destroyed = false;
        this.heart = heart;
        this.volume = 100;
        this.id = heart.getChambers().length + 1;
        this.name += this.id;
    }
    Chamber.prototype.getId = function () {
        return this.id;
    };
    Chamber.prototype.reduce = function (pushPower) {
        if (pushPower === void 0) { pushPower = 100; }
        this.stamina -= pushPower / 10;
        this.heart.transportOxygen(pushPower / 2);
        console.log("\u0441\u043E\u043A\u0440\u0430\u0449\u0435\u043D\u0438\u0435 \u043A\u0430\u043C\u0435\u0440\u044B ".concat(this.getName(), ", \u0441\u0442\u0430\u043C\u0438\u043D\u0430 ").concat(this.getStamina()));
        if (this.stamina < 0) {
            this.destroy();
            console.log("\u0423\u043D\u0438\u0447\u0442\u043E\u0436\u0435\u043D\u0430 ".concat(this.getName()));
        }
        this.heart.setLastWorkingChamber(this.id);
    };
    Chamber.prototype.getStamina = function () {
        return this.stamina;
    };
    Chamber.prototype.destroy = function () {
        this.destroyed = true;
        this.heart.decreaseActiveChambers();
    };
    Chamber.prototype.getDestroyed = function () {
        return this.destroyed;
    };
    Chamber.prototype.getName = function () {
        return this.name;
    };
    return Chamber;
}());
var NeuralController = /** @class */ (function () {
    function NeuralController(HeartEngine) {
        this.processId = null;
        this.heartEngine = HeartEngine;
    }
    NeuralController.prototype.getFreshCamber = function () {
        var chambers = this.heartEngine.getChambers();
        var maxStamina = chambers[chambers.length - 1].getStamina();
        var chamberFreshId = chambers[chambers.length - 1].getId();
        chambers.forEach(function (chamber) {
            if (chamber.getDestroyed() === false) {
                var stamina = chamber.getStamina();
                if (stamina > maxStamina) {
                    maxStamina = stamina;
                    chamberFreshId = chamber.getId();
                }
            }
        });
        if (!chamberFreshId) {
            throw ('Не удалось вычислить менее уставшуюю камеру');
        }
        return this.heartEngine.getChamberById(chamberFreshId);
    };
    NeuralController.prototype.tick = function () {
        var _this = this;
        var freshCamber = this.getFreshCamber();
        this.processId = setTimeout(function () {
            _this.heartEngine.work();
        }, 1200);
        freshCamber.reduce();
        return this.heartEngine.getActiveChamber();
    };
    return NeuralController;
}());
module.exports = HeartEngine;
