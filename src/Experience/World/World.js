import Water from "./Water";

export default class World {
    constructor() {
        this.water = new Water()
    }

    update() {
        this.water.update()
    }
}