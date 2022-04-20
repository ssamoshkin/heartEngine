var STANDARD_CHAMBER_STAMINA = 100;
var DEFAULT_STAMINA_RESTORE = 1;
var HeartEngine = /** @class */ (function () {
    function HeartEngine(chambersCount) {
        this.active = true;
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
    HeartEngine.prototype.stop = function (reason) {
        if (reason === void 0) { reason = null; }
        this.active = false;
        this.textStatus = "Остановлено";
        clearTimeout(this.controller.processId);
        if (reason) {
            console.log("\u0421\u0435\u0440\u0434\u0435 \u0431\u044B\u043B\u043E \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E \u043F\u043E \u043F\u0440\u0438\u0447\u0438\u043D\u0435: ".concat(reason));
        }
    };
    HeartEngine.prototype.work = function () {
        if (this.chambersActiveCount === 0) {
            return this.stop("\u0423\u043D\u0438\u0447\u0442\u043E\u0436\u0435\u043D\u044B \u0432\u0441\u0435 \u043A\u0430\u043C\u0435\u0440\u044B, \u0441\u0435\u0440\u0434\u0446\u0435 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0442\u044C \u0440\u0430\u0431\u043E\u0442\u0443");
        }
        if (this.active) {
            this.controller.tick();
        }
    };
    HeartEngine.prototype.getStatus = function () {
        return this.textStatus;
    };
    HeartEngine.prototype.pumpTo = function (entity) {
        this.entityPumping = entity;
    };
    HeartEngine.prototype.transportOxygen = function (volume) {
        return this.entityPumping.takeOxygen(volume);
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
    HeartEngine.prototype.increasePulse = function (value) {
        this.pulseCurrent += value;
        console.log("debug ".concat(this.pulseCurrent));
        if (this.pulseCurrent > this.pulseMax) {
            this.stop("\u043F\u0440\u0435\u0432\u044B\u0448\u0435\u043D \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u043F\u0443\u043B\u044C\u0441 \u0441\u0435\u0440\u0434\u0446\u0430!");
        }
    };
    HeartEngine.prototype.decreasePulse = function (value) {
        this.pulseCurrent -= value;
        if (this.pulseCurrent < this.pulseMin) {
            this.stop("\u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0440\u0435\u0434\u043A\u0438\u0439 \u043F\u0443\u043B\u044C\u0441, \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C");
        }
    };
    HeartEngine.prototype.getPulse = function () {
        return this.pulseCurrent;
    };
    return HeartEngine;
}());
var Chamber = /** @class */ (function () {
    function Chamber(heart) {
        var _this = this;
        this.volume = Math.floor(Math.random() * 100);
        this.stamina = STANDARD_CHAMBER_STAMINA;
        this.staminaMax = 100;
        this.name = 'Камера №';
        this.destroyed = false;
        this.intervalId = null;
        this.heart = heart;
        this.volume = 100;
        this.id = heart.getChambers().length + 1;
        this.name += this.id;
        this.intervalId = setInterval(function () {
            _this.restoreStamina(DEFAULT_STAMINA_RESTORE);
        }, 100);
    }
    Chamber.prototype.getId = function () {
        return this.id;
    };
    Chamber.prototype.reduce = function (pushPower) {
        if (pushPower === void 0) { pushPower = 100; }
        this.stamina -= pushPower / 10;
        if (this.stamina < 0) {
            this.destroy();
            console.log("\u0423\u043D\u0438\u0447\u0442\u043E\u0436\u0435\u043D\u0430 ".concat(this.getName()));
            return 0; // камера не смогла ничего не прокачать
        }
        console.log("\u0441\u043E\u043A\u0440\u0430\u0449\u0435\u043D\u0438\u0435 \u043A\u0430\u043C\u0435\u0440\u044B ".concat(this.getName(), ", \u0441\u0442\u0430\u043C\u0438\u043D\u0430 ").concat(this.getStamina()));
        this.heart.setLastWorkingChamber(this.id);
        return pushPower / 2; // возвращаем прокаченный объем, о котором знает камера
    };
    Chamber.prototype.getStamina = function () {
        return this.stamina;
    };
    Chamber.prototype.restoreStamina = function (stamina) {
        this.stamina += stamina;
        if (this.stamina > 100) {
            this.stamina = this.staminaMax;
        }
        //console.log(`${this.getName()} восстановлено стамины ${stamina}, всего ${this.stamina}`)
        return this.stamina;
    };
    Chamber.prototype.destroy = function () {
        this.stamina = 0;
        this.destroyed = true;
        this.heart.decreaseActiveChambers();
        clearInterval(this.intervalId);
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
        this.intervalId = null;
        this.heartEngine = HeartEngine;
    }
    NeuralController.prototype.getFreshChamber = function () {
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
        var freshCamber = this.getFreshChamber();
        var pushedVolume = freshCamber.reduce();
        if (pushedVolume === 0) {
            console.log("\u0412\u043D\u0438\u043C\u0430\u043D\u0438\u0435! \u041A\u0430\u043C\u0435\u0440\u0430 \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043F\u0440\u043E\u043A\u0430\u0447\u0430\u043B\u0430!");
        }
        var oxygenDemand = this.heartEngine.transportOxygen(pushedVolume); // после отдачи кислорода органу, узнаем его дальнейшую потребность в нем
        if (oxygenDemand <= 0) {
            this.heartEngine.decreasePulse(10);
        }
        else if (oxygenDemand > 100) {
            this.heartEngine.increasePulse(10);
        }
        this.intervalId = setTimeout(function () {
            _this.heartEngine.work();
        }, 60 / this.heartEngine.getPulse() * 1000);
        return this.heartEngine.getActiveChamber();
    };
    return NeuralController;
}());
module.exports = HeartEngine;
