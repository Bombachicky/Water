import * as THREE from 'three'
import Experience from "../Experience";

export default class Ripple
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        this.ripples = []
        this.rippleAge = { min: 1, max: 2}
        this.rippleSize = { min: .2, max: .5}
        this.rippleStartSize = 0.1
        this.resources.on('ready', () => {
            this.rippleMaterial = new THREE.MeshBasicMaterial({
                map: this.resources.items.ripple,
                color: 0x0000ff,
                transparent: true,
                depthTest: false,
            })
        })
    }


    spawn(position)
    {
        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            this.rippleMaterial.clone()
        )
        this.mesh.position.set(position.x, position.y, position.z)
        this.mesh.scale.set(this.rippleStartSize, this.rippleStartSize, this.rippleStartSize)
        this.mesh.layers.set(2)
        this.scene.add(this.mesh)
        this.ripples.push({
            mesh: this.mesh,
            age: 0,
            lifetime: this.rippleAge.min + Math.random() * (this.rippleAge.max - this.rippleAge.min),
            targetSize:  this.rippleSize.min + Math.random() * (this.rippleSize.max - this.rippleSize.min),
        })
    }


    update()
    {
        for (let i = 0; i < this.ripples.length; i++)
        {
            // add delta in ms
            this.ripples[i].age += this.time.delta / 1000
            // 0 to 1
            const t = this.ripples[i].age / this.ripples[i].lifetime
            if (t >= 1) {
                this.ripples[i].mesh.material.dispose()
                this.scene.remove(this.ripples[i].mesh)
                this.ripples.splice(i, 1)
                
            }
            else
            {
                // Increase size over lifetime
                const size = this.ripples[i].targetSize * (1 - (1 - t) * (1 - t))
                this.ripples[i].mesh.scale.set(size, size, size)

                // Fade out
                this.ripples[i].mesh.material.opacity = 1 - t
            }
        }
    }
}