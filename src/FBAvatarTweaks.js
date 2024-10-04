/**
 * This GLTFLoader plugin does not correspond to a GLTF extension,
 * but is intended to be used with Meta Avatar .glb files to set
 * them up properly for use in Three.js
 */
export class FBAvatarTweaks {

    static AVATAR_MESH_NAME_REGEX = /(S0_L[0-4]_M[01]_V[01]_optimized_geom)|(LOD0[0-3]_combined(_1stPerson)?_geometry)/;

    constructor() {

        this.name = "FB_avatar_tweaks";

    }

    afterRoot( gltf ) {

        gltf.scene.traverse( child => {

            if ( ! FBAvatarTweaks.AVATAR_MESH_NAME_REGEX.test(child.name) ) {

                return;

            }

            // Disable vertex colors as they seem to only be for when the texture hasn't loaded yet
            // Fastload avatars don't seem to have any texture, so would require vertex colors
            child.material.vertexColors = false;

            // Normal map is a bump map.
            // Note: materials can be shared so only swap in case normalMap is set.
            if(child.material.normalMap) {
                child.material.bumpMap = child.material.normalMap;
                child.material.normalMap = null;
            }

        });

    }

}