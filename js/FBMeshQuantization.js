import * as THREE from 'three';

export class FBMeshQuantization {

    constructor() {

        this.name = "FB_mesh_quantization";

    }

    afterRoot( gltf ) {

        const quantizationProperties = gltf.parser.json.extensions['FB_mesh_quantization'];
        if ( !quantizationProperties ) {

            // Model doesn't use FB_mesh_quantization
            return;

        }


        // Iterate over the children
        for ( let child of gltf.scene.children[0].children ) {

            if(!child.isMesh) {
                continue;
            }

            const childGeometry = child.geometry;
            childGeometry.setAttribute('position',
                this._dequantizeMeshPosition(childGeometry.getAttribute('position'), quantizationProperties));

            // Dequantize any morph targets
            childGeometry.morphAttributes.position = childGeometry.morphAttributes.position.map(attribute =>
                this._dequantizeMorphTargetPosition( attribute, quantizationProperties ));
        }

    }

    _dequantizeMeshPosition( attribute, quantizationProperties ) {

        const min = new THREE.Vector3(...quantizationProperties['quantize_mesh_min_POSITION']);
        const max = new THREE.Vector3(...quantizationProperties['quantize_mesh_max_POSITION']);
        const dimensions = new THREE.Vector3().copy(max).sub(min);

        const newAttribute = new THREE.BufferAttribute(new Float32Array(attribute.count * 3), 3, false);

        const vec3 = new THREE.Vector3();
        for(let i = 0; i < attribute.count; i++) {
            vec3.fromBufferAttribute(attribute, i);
            if(i === 0) {
                console.log(vec3);
            }
            newAttribute.setXYZ(i,
                min.x+((vec3.x+1.0)*dimensions.x*.5),
                min.y+((vec3.y+1.0)*dimensions.y*.5),
                min.z+((vec3.z+1.0)*dimensions.z*.5));
        }

        return newAttribute;

    }

    _dequantizeMorphTargetPosition( attribute, quantizationProperties ) {

        const min = new THREE.Vector3(...quantizationProperties['quantize_min_POSITION']);
        const max = new THREE.Vector3(...quantizationProperties['quantize_max_POSITION']);
        const dimensions = new THREE.Vector3().copy(max).sub(min);

        const newAttribute = new THREE.BufferAttribute(new Float32Array(attribute.count * 3), 3, false);

        const vec3 = new THREE.Vector3();
        for(let i = 0; i < attribute.count; i++) {
            vec3.fromBufferAttribute(attribute, i);
            newAttribute.setXYZ(i,
                min.x+dimensions.x/2.0-(vec3.x*dimensions.x*.25),
                min.y+dimensions.y/2.0-(vec3.y*dimensions.y*.25),
                min.z+dimensions.z/2.0-(vec3.z*dimensions.z*.25));
        }

        return newAttribute;

    }

}