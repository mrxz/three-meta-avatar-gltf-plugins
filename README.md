# GLTFLoader plugins for loading Meta Avatars
[![npm version](https://img.shields.io/npm/v/@fern-solutions/three-meta-avatar-gltf-plugins.svg?style=flat-square)](https://www.npmjs.com/package/@fern-solutions/three-meta-avatar-gltf-plugins)
[![npm version](https://img.shields.io/npm/l/@fern-solutions/three-meta-avatar-gltf-plugins.svg?style=flat-square)](https://www.npmjs.com/package/@fern-solutions/three-meta-avatar-gltf-plugins)
[![github](https://flat.badgen.net/badge/icon/github?icon=github&label)](https://github.com/mrxz/three-meta-avatar-gltf-plugins/)
[![twitter](https://flat.badgen.net/badge/twitter/@noerihuisman/blue?icon=twitter&label)](https://twitter.com/noerihuisman)
[![ko-fi](https://img.shields.io/badge/ko--fi-buy%20me%20a%20coffee-ff5f5f?style=flat-square)](https://ko-fi.com/fernsolutions)

**This project is in an experimental state**

## Usage
See [example/index.html](example/index.html) for an example of how to use this.

The avatar .glb files contain multiple versions all with names matching `S0_L[0-4]_M[01]_V[01]_optimized_geom`. The meaning of each segment:
| Segment | Meaning |
| -- | -- |
| `S0` | Unknown |
| `L[0-4]` | Lod level, 0 being the highest and 4 the lowest |
| `M[01]` | Model type, 0 being full body and 1 being upper body only |
| `V[01]` | Viewer type, 0 being first person (no head geometry) and 1 being third person |

For example: `S0_L0_M0_V1_optimized_geom` will be the highest detail (`L0`), full body (`M0`), with head (`V1`).

## Sourcing avatar files
The [Meta Avatars SDK](https://developer.oculus.com/downloads/package/meta-avatars-sdk/) comes bundled with 32 sample avatars that can be used. If you'd rather want to use your own avatar, connect your Quest 2 and search for a `.glb` file in either one of these directories:
* `Quest 2/Internal shared storage/Android/data/com.oculus.shellenv/files/Oculus/Avatars2/`
* `Quest 2/Internal shared storage/Android/data/com.oculus.avatar2/cache/Oculus/Avatars2/`

There might be multiple files which are either older versions of your avatar or cached avatars of others. When in doubt simply make a small tweak to your avatar and save it. This should result in a new file that's easy to filter out based on the modified date.

## Limitations
 * Meta Avatars appear to have two color vertex attributes, neither seem to provide correct output when taken as-is, so vertex colors are disabled.
 * The normals and tangents aren't dequantized yet.
 * It assumes that the KTX2 texture is of a specific format and that the browser supports this natively (no transcoding is done)
 * Textures for avatars intended for the Rift can't be loaded