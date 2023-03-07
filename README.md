# GLTFLoader plugins for loading Meta Avatars
[![npm version](https://img.shields.io/npm/v/@fern-solutions/three-meta-avatar-gltf-plugins.svg?style=flat-square)](https://www.npmjs.com/package/@fern-solutions/three-meta-avatar-gltf-plugins)
[![npm version](https://img.shields.io/npm/l/@fern-solutions/three-meta-avatar-gltf-plugins.svg?style=flat-square)](https://www.npmjs.com/package/@fern-solutions/three-meta-avatar-gltf-plugins)
[![github](https://flat.badgen.net/badge/icon/github?icon=github&label)](https://github.com/mrxz/three-meta-avatar-gltf-plugins/)
[![twitter](https://flat.badgen.net/twitter/follow/noerihuisman)](https://twitter.com/noerihuisman)
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

## Limitations
 * Meta Avatars appear to have two color vertex attributes, neither seem to provide correct output when taken as-is, so vertex colors are disabled.
 * The normals and tangents aren't dequantized yet.