import { FBTextureKTX2Loader } from './FBTextureKTX2Loader.js';
import { NearestFilter, LinearFilter } from 'three';

export class FBTextureKTX2 {

    constructor( parser ) {

        this.parser = parser;
        this.loader = new FBTextureKTX2Loader();
        this.name = "FB_texture_KTX2";

    }

    loadTexture( textureIndex ) {

        const parser = this.parser;
        const json = parser.json;

        const textureDef = json.textures[ textureIndex ];

        if ( ! textureDef.extensions || ! textureDef.extensions[ this.name ] ) {

            return null;

        }

        const extension = textureDef.extensions[ this.name ];

        if ( ! this.loader ) {

            // Assumes that the extension is optional and that a fallback texture is present
            return null;

        }

        return parser.loadTextureImage( textureIndex, extension.source, this.loader )
            .then( fixMagFilter );

    }

}

// The v29 avatars seem to set the TEXTURE_MAG_FILTER to LINEAR_MIPMAP_LINEAR which is a min filter, not a mag filter.
function fixMagFilter ( texture ) {

    if ( texture.magFilter !== NearestFilter && texture.magFilter !== LinearFilter ) {

        texture.magFilter = LinearFilter;

    }

    return texture;

}