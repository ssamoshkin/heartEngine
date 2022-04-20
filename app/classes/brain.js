var Brain = /** @class */ (function () {
    function Brain() {
        var _this = this;
        this.oxygenDemand = 100;
        this.oxygenDemandMax = 600;
        this.processId = null;
        this.alive = true;
        this.processId = setInterval(function () {
            _this.consumeOxygen();
            if (_this.getOxygenDemand() <= 0) {
                _this.destroy();
                clearInterval(_this.processId);
                console.log("\u041C\u043E\u0437\u0433 \u043F\u043E\u0433\u0438\u0431\u0430\u0435\u0442");
            }
            console.log("\u0422\u0435\u043A\u0443\u0449\u0435\u0435 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u043A\u0438\u0441\u043B\u043E\u0440\u043E\u0434\u0430 \u0432 \u043C\u043E\u0437\u0433\u0435 ".concat(_this.getOxygenDemand()));
        }, 1000);
    }
    Brain.prototype.consumeOxygen = function (volume) {
        if (volume === void 0) { volume = 100; }
        this.oxygenDemand -= volume;
    };
    Brain.prototype.restoreOxygen = function (volume) {
        this.oxygenDemand += volume;
        if (this.oxygenDemand > this.oxygenDemandMax) {
            this.oxygenDemand = this.oxygenDemandMax;
        }
    };
    Brain.prototype.getOxygenDemand = function () {
        return this.oxygenDemand;
    };
    Brain.prototype.takeOxygen = function (volume) {
        if (!this.alive)
            return;
        console.log("\u041C\u043E\u0437\u0433\u043E\u043C \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E \u043A\u0438\u0441\u043B\u043E\u0440\u043E\u0434\u0430: ".concat(volume));
        this.restoreOxygen(volume);
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
