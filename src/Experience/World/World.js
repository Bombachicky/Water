import * as THREE from 'three'
import Experience from "../Experience"
import Water from "./Water"
import Ripple from './Ripple'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.water = new Water()
        this.ripple = new Ripple()
    }

    update() {
        this.water.update()
        this.ripple.update()
    }
}