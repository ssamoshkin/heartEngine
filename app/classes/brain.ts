class Brain {
    static NAME: string = "Мозг";
    private oxygenStock: number;
    private oxygenDemand: number; // условное значение нехватки кислорода
    private oxygenMax: number = 600;
    private readonly intervalId = null;
    private alive = true;

    constructor(oxygenVolume = 600) {
        this.oxygenStock = oxygenVolume;
        this.intervalId = setInterval(() => {
            this.consumeOxygen()

            if (this.getOxygenStock() <= 0) {
                this.destroy();
            }

            //console.log(`Текущее количество кислорода в мозге ${this.getOxygenDemand()}`)
        }, 1000);
    }

    consumeOxygen(volume = 100): void {
        this.oxygenStock -= volume;
    }

    restoreOxygen(volume): void {
        this.oxygenStock += volume;
        if (this.oxygenStock > this.oxygenMax) {
            this.oxygenStock = this.oxygenMax;
        }
    }

    getOxygenStock(): number {
        return this.oxygenStock;
    }

    getOxygenDemand(): number {
        return this.oxygenMax - this.oxygenStock;
    }

    takeOxygen(volume): number {
        if (!this.alive) return;

        console.log(`Мозгом получено кислорода: ${volume}`);
        this.restoreOxygen(volume);

        return this.getOxygenDemand();
    }

    getState(): string {
        return this.alive ? 'alive' : 'dead';
    }

    destroy(): void {
        this.alive = false;
        clearInterval(this.intervalId);
        console.log(`Мозг погибает`);
    }
}

module.exports = Brain;