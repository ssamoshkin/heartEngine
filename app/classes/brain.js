var Brain = /** @class */ (function () {
    function Brain(oxygenVolume) {
        if (oxygenVolume === void 0) { oxygenVolume = 600; }
        var _this = this;
        this.oxygenMax = 600;
        this.processId = null;
        this.alive = true;
        this.oxygenStock = oxygenVolume;
        this.processId = setInterval(function () {
            _this.consumeOxygen();
            if (_this.getOxygenStock() <= 0) {
                _this.destroy();
                clearInterval(_this.processId);
                console.log("\u041C\u043E\u0437\u0433 \u043F\u043E\u0433\u0438\u0431\u0430\u0435\u0442");
            }
            //console.log(`Текущее количество кислорода в мозге ${this.getOxygenDemand()}`)
        }, 1000);
    }
    Brain.prototype.consumeOxygen = function (volume) {
        if (volume === void 0) { volume = 100; }
        this.oxygenStock -= volume;
    };
    Brain.prototype.restoreOxygen = function (volume) {
        this.oxygenStock += volume;
        if (this.oxygenStock > this.oxygenMax) {
            this.oxygenStock = this.oxygenMax;
        }
    };
    Brain.prototype.getOxygenStock = function () {
        return this.oxygenStock;
    };
    Brain.prototype.getOxygenDemand = function () {
        return this.oxygenMax - this.oxygenStock;
    };
    Brain.prototype.takeOxygen = function (volume) {
        if (!this.alive)
            return;
        console.log("\u041C\u043E\u0437\u0433\u043E\u043C \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E \u043A\u0438\u0441\u043B\u043E\u0440\u043E\u0434\u0430: ".concat(volume));
        this.restoreOxygen(volume);
        return this.getOxygenDemand();
    };
    Brain.prototype.getState = function () {
        return this.alive ? 'alive' : 'dead';
    };
    Brain.prototype.destroy = function () {
        this.alive = false;
    };
    Brain.NAME = "Мозг";
    return Brain;
}());
module.exports = Brain;
