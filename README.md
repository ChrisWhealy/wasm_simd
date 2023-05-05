# WebAssembly SIMD Instructions

Generally speaking, the documentation on how WebAssembly instructions are to be used can only be described as "*very poor*".
There is a [comprehensive core language specification](https://webassembly.github.io/spec/core/), but whilst this rigorous Backus-Naur-style definition is necessary for the language designers, it borders on useless as an information source for application developers wishing to make use these of instructions in real-life programming situations.

This is particularly true of the SIMD instructions whose arguments are often supplied in a non-intuitive order and sometimes are not even documented.

This repo is a first towards providing worked examples of how each WebAssembly SIMD instruction can be used.

***THIS IS A WORK IN PRGRESS***

## Table of Contents

1. [The SIMD Concept](./docs/simd_concept.md)
1. [Misbehaving `f32` Values](./docs/f32.md)
1. [`splat`](./docs/splat.md)
1. [`swizzle`](./docs/swizzle.md)

## Usage

At the moment, only the unit tests can be run:

```bash
npm run buildAndTest
```

This will produce output something like the following:

```bash
> understanding-wasm-simd-instructions@1.1.0 buildAndTest
> wat2wasm ./src/simd.wat -o ./bin/simd.wasm && node ./tests/main.mjs

✅ extract_lane: extract_lane_0_i8_u passed

SNIP

✅ splat: splat_f64 passed within acceptable floating point tolerance
```


