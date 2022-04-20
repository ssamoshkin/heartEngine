var HeartEngine = /** @class */ (function () {
    function HeartEngine(chambersCount) {
        this.chambersIndexIds = {}; // доступ к объектам-камер по индексам
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
        this.controller.tick();
    };
    HeartEngine.prototype.getStatus = function () {
        return this.textStatus;
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
    Chamber.prototype.reduce = function (pushPower) {
        if (pushPower === void 0) { pushPower = 100; }
        this.stamina -= pushPower / 10;
        console.log("\u0441\u043E\u043A\u0440\u0430\u0449\u0435\u043D\u0438\u0435 \u043A\u0430\u043C\u0435\u0440\u044B ".concat(this.getName(), ", \u0441\u0442\u0430\u043C\u0438\u043D\u0430 ").concat(this.getStamina()));
        if (this.stamina < 0) {
            this.heart.stop();
            console.log("\u041E\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 \u0441\u0435\u0440\u0434\u0446\u0430, \u0442\u0430\u043A \u043A\u0430\u043A \u043F\u0435\u0440\u0435\u0443\u0442\u043E\u043C\u0438\u043B\u0430\u0441\u044C ".concat(this.getName()));
        }
        this.heart.setLastWorkingChamber(this.id);
    };
    Chamber.prototype.getStamina = function () {
        return this.stamina;
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
            var stamina = chamber.getStamina();
            if (stamina > maxStamina) {
                maxStamina = stamina;
                chamberFreshId = chamber.getId();
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
        }, 1000);
        freshCamber.reduce();
        return this.heartEngine.getActiveChamber();
    };
    return NeuralController;
}());
module.exports = HeartEngine;
