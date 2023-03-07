import {
    CompressedTexture,
    CompressedArrayTexture,
    Data3DTexture,
    DataTexture,
    FileLoader,
    LinearFilter,
    LinearMipmapLinearFilter,
    Loader,
    RGBA_ASTC_6x6_Format,
    sRGBEncoding,
    UnsignedByteType,
} from 'three';
import {
    read,
    KHR_SUPERCOMPRESSION_NONE,
    KHR_SUPERCOMPRESSION_ZSTD,
    VK_FORMAT_ASTC_6x6_SRGB_BLOCK,
} from 'three/addons/libs/ktx-parse.module.js';
import { ZSTDDecoder } from 'three/addons/libs/zstddec.module.js';

export class FBTextureKTX2Loader extends Loader {

    /**
     * Mapping and support matrix for vkFormat to WebGL format
     */
    static FORMAT_MAP = {
        [ VK_FORMAT_ASTC_6x6_SRGB_BLOCK ]: RGBA_ASTC_6x6_Format
    };

    load( url, onLoad, onProgress, onError ) {

        const loader = new FileLoader( this.manager );

        loader.setResponseType( 'arraybuffer' );
        loader.setWithCredentials( this.withCredentials );

        loader.load( url, ( buffer ) => {

            this._createTexture( buffer )
                .then( ( texture ) => onLoad ? onLoad( texture ) : null )
                .catch( onError );

        }, onProgress, onError );

    }

    /**
     * @param {ArrayBuffer} buffer
     * @param {object?} config
     * @return {Promise<CompressedTexture|CompressedArrayTexture|DataTexture|Data3DTexture>}
     */
    async _createTexture( buffer, config = {} ) {

        const container = read( new Uint8Array( buffer ) );

        if ( !FBTextureKTX2Loader.FORMAT_MAP[container.vkFormat] ) {

            throw new Error( 'FBTextureKTX2Loader: Unsupported vkFormat: ' + container.vkFormat );

        }

        const mipmaps = [];

        let width = container.pixelWidth;
        let height = container.pixelHeight;
        for (let level of container.levels) {
            let levelData = null;
            if ( container.supercompressionScheme === KHR_SUPERCOMPRESSION_NONE ) {

                levelData = level.levelData;

            } else if ( container.supercompressionScheme === KHR_SUPERCOMPRESSION_ZSTD ) {

                if ( ! _zstd ) {

                    _zstd = new Promise( async ( resolve ) => {

                        const zstd = new ZSTDDecoder();
                        await zstd.init();
                        resolve( zstd );

                    } );

                }

                levelData = ( await _zstd ).decode( level.levelData, level.uncompressedByteLength );

            } else {

                throw new Error( 'FBTextureKTX2Loader: Unsupported supercompressionScheme.' );

            }

            mipmaps.push({ data: levelData, width, height });
            width /= 2;
            height /= 2;
        }

        const texture = new CompressedTexture( mipmaps, container.pixelWidth, container.pixelHeight, RGBA_ASTC_6x6_Format, UnsignedByteType );

        texture.minFilter = mipmaps.length === 1 ? LinearFilter : LinearMipmapLinearFilter;
        texture.magFilter = LinearFilter;
        texture.generateMipmaps = false;

        texture.needsUpdate = true;
        texture.encoding = sRGBEncoding;
        texture.premultiplyAlpha = false;

        return texture;

    }
}