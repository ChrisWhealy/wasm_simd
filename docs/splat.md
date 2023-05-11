# Splat

`splat` creates a 128-bit vector with an identical value in each lane, then pushes the result onto the stack.
There are 6 versions of `splat`; one for each vector shape:

```wast
;; Create a vector with 16 8-bit lanes each containing integer 0xFF
(i8x16.splat (i32.const 0xff))

;; Create a vector with 8 16-bit lanes each containing integer 0x0a0b
(i16x8.splat (i32.const 0x0a0b))

;; Create a vector with 4 32-bit lanes each containing integer 0xdeadbeef
(i32x4.splat (i32.const 0xdeadbeef))

;; Create a vector with 2 64-bit lanes each containing integer 0x0001020304050607
(i64x2.splat (i64.const 0x0001020304050607))

;; Create a vector with 4 32-bit lanes each containing PI as 3.141592654
(f32x4.splat (f32.const 3.141592654))

;; Create a vector with 2 64-bit lanes each containing PI as 3.141592653589793
(f64x2.splat (f64.const 3.141592653589793))
```

Given that WebAssembly does not have explicit datatypes for 8- or 16-bit integers, if you wish to use an 8- or 16-bit initial value, that must be supplied in an `i32`.
