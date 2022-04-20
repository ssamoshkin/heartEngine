class Brain {
    static NAME: string = "Мозг";
    private oxygenDemand: number;
    private oxygenDemandMax: number = 600;
    private readonly processId = null;
    private alive = true;

    constructor(oxygenVolume = 600) {
        this.oxygenDemand = oxygenVolume;
        this.processId = setInterval(() => {
            this.consumeOxygen()

            if (this.getOxygenDemand() <= 0) {
                this.destroy();
                clearInterval(this.processId);
                console.log(`Мозг погибает`);
            }

            //console.log(`Текущее количество кислорода в мозге ${this.getOxygenDemand()}`)
        }, 1000);
    }

    consumeOxygen(volume = 100): void {
        this.oxygenDemand -= volume;
    }

    restoreOxygen(volume): void {
        this.oxygenDemand += volume;
        if (this.oxygenDemand > this.oxygenDemandMax) {
            this.oxygenDemand = this.oxygenDemandMax;
        }
    }

    getOxygenDemand(): number {
        return this.oxygenDemand;
    }

    takeOxygen(volume): void {
        if (!this.alive) return;

        console.log(`Мозгом получено кислорода: ${volume}`);
        this.restoreOxygen(volume);
    }

    getState(): string {
        return this.alive ? 'alive' : 'dead';
    }

    destroy(): void {
        this.alive = false;
    }
}

module.exports = Brain;