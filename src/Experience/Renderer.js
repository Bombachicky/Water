import * as THREE from 'three'
import Experience from "./Experience";

export default class Renderer
{
    constructor()
    {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        this.setInstance()
    }

    setInstance()
    {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)

        this.rippleTarget = new THREE.WebGLRenderTarget(
            this.sizes.width * this.sizes.pixelRatio, 
            this.sizes.height * this.sizes.pixelRatio
        )
        this.rippleTexture = this.rippleTarget.texture


        this.depthTarget = new THREE.WebGLRenderTarget(
            this.sizes.width * this.sizes.pixelRatio, 
            this.sizes.height * this.sizes.pixelRatio, 
            {
                depthTexture: new THREE.DepthTexture()
            })
        this.depthTexture = this.depthTarget.depthTexture

        this.normalsMaterial = new THREE.MeshNormalMaterial()
        this.normalsTarget = new THREE.WebGLRenderTarget(
            this.sizes.width * this.sizes.pixelRatio, 
            this.sizes.height * this.sizes.pixelRatio
        )
        this.normalsTexture = this.normalsTarget.texture
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    update()
    {
        // layer 0 only - excludes water)
        this.camera.instance.layers.set(0)

        // Render normals
        this.scene.overrideMaterial = this.normalsMaterial
        this.instance.setRenderTarget(this.normalsTarget)
        this.instance.render(this.scene, this.camera.instance)
        this.scene.overrideMaterial = null

        // Render depth
        this.instance.setRenderTarget(this.depthTarget)
        this.instance.render(this.scene, this.camera.instance)

        // Render ripples (layer 2 only)
        this.camera.instance.layers.set(2)
        this.instance.setRenderTarget(this.rippleTarget)
        this.instance.render(this.scene, this.camera.instance)

        // Render to screen (layers 0 + 1 + 2 for debugging)
        this.camera.instance.layers.set(0)
        this.camera.instance.layers.enable(1)
        this.instance.setRenderTarget(null)
        this.instance.render(this.scene, this.camera.instance)
    }
}