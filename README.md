# WebAssembly SIMD Instructions

Generally speaking, the documentation on how WebAssembly instructions are to be used can only be described as "*very poor*".
There is a [comprehensive core language specification](https://webassembly.github.io/spec/core/), but whilst this rigorous Backus-Naur-style definition is necessary for the language designers, it borders on useless as an information source for application developers wishing to make use these of instructions in real-life programming situations.

This is particularly true of the SIMD instructions whose arguments are often supplied in a non-intuitive order and sometimes are not even documented.

This repo is a first step towards providing a set of worked examples of how each WebAssembly SIMD instruction can be used.

***THIS IS A WORK IN PRGRESS***

## Table of Contents

1. [The SIMD Concept](./docs/simd_concept.md)
1. [Misbehaving `f32` Values](./docs/f32.md)
1. [`splat`](./docs/splat.md)
1. [`swizzle`](./docs/swizzle.md)
2. [`add`](./docs/add.md)

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

✅ splat: splat_f64 passed
```

## Transferring Vectors (`v128`) To/From the Host Environment

At the moment, WASI interfaces such as `wasmtime` or `wasmer` can happily transport 128-bit values into or out of a WebAssembly module.
However, the WebAssembly implementation in NodeJS lacks this capability due to the fact that JavaScript has no datatype suitable for holding a single value that wide.

That said, before JavaScript was able to transport 64-bit values across the Host/WebAssembly boundary, a workaround was available that took a `.wasm` module, searched through all the exported functions looking for 64-bit `param`s and `result`s, and transformed them into arrays of 8 `u8`s.
This then allowed JavaScript `BigInt`s to be passed across the boundary.

A similar transformation process is now needed in order to support 128-bit values (presumably transforming them into arrays of 16 `u8`s)

Until such a workaround is available, anytime you need a 128-bit value to cross the Host/WebAssembly boundary, it must be written it to shared memory and a pointer passed instead.
