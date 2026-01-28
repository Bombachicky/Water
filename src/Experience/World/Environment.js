import * as THREE from 'three'
import Experience from "../Experience";

export default class Environment
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.setSunlight()
    }

    setSunlight()
    {
        this.sunlight = new THREE.DirectionalLight('#ffffff', 4)
        this.sunlight.position.set(3.5, 2, -1.25)
        this.sunlight.castShadow = true
        this.scene.add(this.sunlight)
    }
}