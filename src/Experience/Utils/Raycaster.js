import * as THREE from 'three'
import Experience from '../Experience';

export default class Raycaster
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.pointer = new THREE.Vector2()
        this.raycaster = new THREE.Raycaster()
        // water is on layer 1 and we only want to intersect with the water
        this.raycaster.layers.enable(1)

        window.addEventListener('mousemove', (event) => {
            this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
            this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1

            this.raycaster.setFromCamera(this.pointer, this.camera.instance)
            this.intersects = this.raycaster.intersectObjects(this.scene.children)

            if (this.intersects.length > 0) 
            {
                const hitPoint = this.intersects[0].point
                this.experience.world.ripple.spawn(hitPoint)
            }
        })
    }
}