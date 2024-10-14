import * as THREE from 'three';

export class FBMeshQuantization {

    constructor() {

        this.name = "FB_mesh_quantization";

    }

    afterRoot( gltf ) {

        const quantizationProperties = gltf.parser.json.extensions?.['FB_mesh_quantization'];
        if ( !quantizationProperties ) {

            // Model doesn't use FB_mesh_quantization
            return;

        }


        // Traverse children
        gltf.scene.traverse(child => {

            if(!child.isMesh) {
                return;
            }

            const childGeometry = child.geometry;
            childGeometry.setAttribute('position',
                this._dequantizeAttribute( childGeometry.getAttribute('position'), quantizationProperties['quantize_mesh_min_POSITION'], quantizationProperties['quantize_mesh_max_POSITION']));
            childGeometry.setAttribute('normal',
                this._dequantizeAttribute( childGeometry.getAttribute('normal'), quantizationProperties['quantize_min_NORMAL'], quantizationProperties['quantize_max_NORMAL'] ));

            // Dequantize any morph targets
            if('position' in childGeometry.morphAttributes) {
                childGeometry.morphAttributes.position = childGeometry.morphAttributes.position.map(attribute =>
                    this._dequantizeAttribute( attribute, quantizationProperties['quantize_min_POSITION'], quantizationProperties['quantize_max_POSITION'] ));
            }

        });

    }

    _dequantizeAttribute( attribute, minValues, maxValues ) {

        const min = new THREE.Vector3(...minValues);
        const max = new THREE.Vector3(...maxValues);
        const dimensions = new THREE.Vector3().copy(max).sub(min);

        const newAttribute = new THREE.BufferAttribute(new Float32Array(attribute.count * 3), 3, false);

        const vec3 = new THREE.Vector3();
        for(let i = 0; i < attribute.count; i++) {
            vec3.fromBufferAttribute(attribute, i);
            newAttribute.setXYZ(i,
                min.x+((vec3.x+1.0)*dimensions.x*.5),
                min.y+((vec3.y+1.0)*dimensions.y*.5),
                min.z+((vec3.z+1.0)*dimensions.z*.5));
        }

        return newAttribute;

    }

}