# Splat

`splat` creates a 128-bit vector with an identical value in each lane, then pushes the result onto the stack.
There are 6 versions of `splat`; one for each vector shape:

```wast
;; Create a vector with 16 8-bit lanes each containing 0xFF
(i8x16.splat (i32.const 0xff))

;; Create a vector with 8 16-bit lanes each containing 0x0a0b
(i16x8.splat (i32.const 0x0a0b))

;; Create a vector with 4 32-bit lanes each containing 0xdeadbeef
(i32x4.splat (i32.const 0xdeadbeef))
```

Given that WebAssembly does not have explicit datatypes for 8- or 16-bit integers, if you wish to use an 8- or 16-bit initial value, that must be supplied in an `i32`.
