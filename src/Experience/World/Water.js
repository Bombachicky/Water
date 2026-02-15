import * as THREE from 'three'
import Experience from "../Experience";
import vertexShader from '../../shaders/water/vertex.glsl'
import fragmentShader from '../../shaders/water/fragment.glsl'

export default class Water {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.renderer = this.experience.renderer
        this.debug = this.experience.debug

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
        this.setTextures()

        if (this.debug.active) {
            this.setDebug()
        }
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(2, 2, 128, 128)
    }

    setMaterial() {
        const camera = this.experience.camera.instance
        
        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                uDepthGradientShallow: { value: new THREE.Color(0.325, 0.807, 0.971) },
                uDepthGradientDeep: { value: new THREE.Color(0.086, 0.407, 1.0) },
                uDepthMaxDistance: { value: 0.75 },
                uDepthTexture: { value: this.renderer.depthTexture },
                uNormalsTexture: { value: this.renderer.normalsTexture },
                uCameraNear: { value: camera.near },
                uCameraFar: { value: camera.far },
                uNoiseTiling: { value: new THREE.Vector2(1, 4) },
                uNoiseOffset: { value: new THREE.Vector2(0, 300) },
                uSurfaceNoiseCutoff: { value: 0.777 },
                uSurfaceNoise: { value: null },
                uFoamMaxDistance: { value: 0.25 },
                uFoamMinDistance: { value: 0.2 },
                uSurfaceNoiseScroll: { value: new THREE.Vector2(0.03, 0.03) },
                uTime: { value: 0 },
                uSurfaceDistortion: { value: null },
                uSurfaceDistortionAmount: { value: 0.27 },
                uRippleTexture: { value: this.renderer.rippleTexture }
            }
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.layers.set(1)
        this.scene.add(this.mesh)
    }

    setTextures() {
        this.resources.on('ready', () => {
            const noise = this.resources.items.perlinNoise
            noise.wrapS = noise.wrapT = THREE.RepeatWrapping
            this.material.uniforms.uSurfaceNoise.value = noise

            const distortion = this.resources.items.waterDistortion
            distortion.wrapS = distortion.wrapT = THREE.RepeatWrapping
            this.material.uniforms.uSurfaceDistortion.value = distortion
        })
    }

    setDebug() {
        this.debugFolder = this.debug.ui.addFolder('Water')

        this.debugFolder.add(this.material.uniforms.uDepthMaxDistance, 'value')
            .min(0).max(3).step(0.01).name('Depth Max Distance')

        this.debugFolder.add(this.material.uniforms.uSurfaceNoiseCutoff, 'value')
            .min(0).max(1).step(0.01).name('Noise Cutoff')

        this.debugFolder.add(this.material.uniforms.uFoamMaxDistance, 'value')
            .min(0).max(1).step(0.01).name('Foam Max Distance')

        this.debugFolder.add(this.material.uniforms.uFoamMinDistance, 'value')
            .min(0).max(1).step(0.01).name('Foam Min Distance')

        this.debugFolder.add(this.material.uniforms.uSurfaceDistortionAmount, 'value')
            .min(0).max(1).step(0.01).name('Distortion Amount')
    }

    update() {
        this.material.uniforms.uTime.value = this.experience.time.elapsed * 0.001
    }
}