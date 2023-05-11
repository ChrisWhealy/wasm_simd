(module
  (memory
    (export "memory") 1
    ;; 0000-000F  8-bit unsigned integers
    ;; 0010-001F  8-bit signed integers
    ;; 0020-002F 16-bit unsigned integers
    ;; 0030-003F 16-bit signed integers
    ;; 0040-004F 32-bit signed integers
    ;; 0050-005F 32-bit floats
    ;; 0060-006F 64-bit signed integers
    ;; 0070-007F 64-bit floats
    ;; 0080-008F 16, i8 swizzle indices
    ;; 0090-009F v128 data
    ;; 00A0-00AF 1st Shuffle arg data
    ;; 00B0-00BF 2nd Shuffle arg data
    ;; 00C0-00CF Values that will overflow when added/multiplied
    ;; 00D0-00DF Values that will overflow when added/multiplied etc
  )

  (global $I8_DATA_U       i32 (i32.const 0x0000))
  (global $I8_DATA_S       i32 (i32.const 0x0010))
  (global $I16_DATA_U      i32 (i32.const 0x0020))
  (global $I16_DATA_S      i32 (i32.const 0x0030))
  (global $I32_DATA        i32 (i32.const 0x0040))
  (global $F32_DATA        i32 (i32.const 0x0050))
  (global $I64_DATA        i32 (i32.const 0x0060))
  (global $F64_DATA        i32 (i32.const 0x0070))
  (global $SWIZZLE_INDICES i32 (i32.const 0x0080))
  (global $V128_DATA       i32 (i32.const 0x0090))
  (global $SHUFFLE_ARG_1   i32 (i32.const 0x00A0))
  (global $SHUFFLE_ARG_2   i32 (i32.const 0x00B0))

  (global $OUTPUT_PTR i32 (i32.const 0x0100))

  ;; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  ;; Swizzle
  ;; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  (func (export "swizzle_im")
        (result i32 i32)

    (v128.store
      (global.get $OUTPUT_PTR)
      (i8x16.swizzle
        (v128.load (global.get $I8_DATA_U))
        (v128.const i8x16 3 2 1 0 7 6 5 4 11 10 9 8 15 14 13 12)
      )
    )

    (global.get $OUTPUT_PTR)  ;; Byte offset
    (i32.const 16)            ;; Byte length
  )

  (func (export "swizzle_var")
        (result i32 i32)

    (v128.store
      (global.get $OUTPUT_PTR)
      (i8x16.swizzle
        (v128.load (global.get $I8_DATA_U))
        (v128.load (global.get $SWIZZLE_INDICES))
      )
    )

    (global.get $OUTPUT_PTR)  ;; Byte offset
    (i32.const 16)            ;; Byte length
  )

  ;; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  ;; Shuffle
  ;; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  (func (export "shuffle")
        (result i32 i32)

    (v128.store
      (global.get $OUTPUT_PTR)
      ;; Take alternate bytes from each vector
      (i8x16.shuffle
        0 17 2 19 4 21 6 23 8 25 10 27 12 29 14 31
        (v128.load (global.get $SHUFFLE_ARG_1))
        (v128.load (global.get $SHUFFLE_ARG_2))
      )
    )

    (global.get $OUTPUT_PTR)  ;; Byte offset
    (i32.const 16)            ;; Byte length
  )

  ;; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  ;; Splat
  ;; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  (func (export "splat_i8")
        (param $init i32)
        (result i32 i32)

    (v128.store (global.get $OUTPUT_PTR) (i8x16.splat (local.get $init)))

    (global.get $OUTPUT_PTR)  ;; Byte offset
    (i32.const 16)            ;; Byte length
  )

  (func (export "splat_i16")
        (param $init i32)
        (result i32 i32)

    (v128.store (global.get $OUTPUT_PTR) (i16x8.splat (local.get $init)))

    (global.get $OUTPUT_PTR)  ;; Byte offset
    (i32.const 16)            ;; Byte length
  )

  (func (export "splat_i32")
        (param $init i32)
        (result i32 i32)

    (v128.store (global.get $OUTPUT_PTR) (i32x4.splat (local.get $init)))

    (global.get $OUTPUT_PTR)  ;; Byte offset
    (i32.const 16)            ;; Byte length
  )

  (func (export "splat_i64")
        (param $init i64)
        (result i32 i32)

    (v128.store (global.get $OUTPUT_PTR) (i64x2.splat (local.get $init)))

    (global.get $OUTPUT_PTR)  ;; Byte offset
    (i32.const 16)            ;; Byte length
  )

  (func (export "splat_f32")
        (param $init f32)
        (result i32 i32)

    (v128.store (global.get $OUTPUT_PTR) (f32x4.splat (local.get $init)))

    (global.get $OUTPUT_PTR)  ;; Byte offset
    (i32.const 16)            ;; Byte length
  )

  (func (export "splat_f64")
        (param $init f64)
        (result i32 i32)

    (v128.store (global.get $OUTPUT_PTR) (f64x2.splat (local.get $init)))

    (global.get $OUTPUT_PTR)  ;; Byte offset
    (i32.const 16)            ;; Byte length
  )

  ;; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  ;; Extract lane
  ;; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  ;; i8x16 unsigned
  (func (export "extract_lane_0_i8_u")  (result i32) (i8x16.extract_lane_u 0  (v128.load (global.get $I8_DATA_U))))
  (func (export "extract_lane_1_i8_u")  (result i32) (i8x16.extract_lane_u 1  (v128.load (global.get $I8_DATA_U))))
  (func (export "extract_lane_2_i8_u")  (result i32) (i8x16.extract_lane_u 2  (v128.load (global.get $I8_DATA_U))))
  (func (export "extract_lane_3_i8_u")  (result i32) (i8x16.extract_lane_u 3  (v128.load (global.get $I8_DATA_U))))
  (func (export "extract_lane_4_i8_u")  (result i32) (i8x16.extract_lane_u 4  (v128.load (global.get $I8_DATA_U))))
  (func (export "extract_lane_5_i8_u")  (result i32) (i8x16.extract_lane_u 5  (v128.load (global.get $I8_DATA_U))))
  (func (export "extract_lane_6_i8_u")  (result i32) (i8x16.extract_lane_u 6  (v128.load (global.get $I8_DATA_U))))
  (func (export "extract_lane_7_i8_u")  (result i32) (i8x16.extract_lane_u 7  (v128.load (global.get $I8_DATA_U))))
  (func (export "extract_lane_8_i8_u")  (result i32) (i8x16.extract_lane_u 8  (v128.load (global.get $I8_DATA_U))))
  (func (export "extract_lane_9_i8_u")  (result i32) (i8x16.extract_lane_u 9  (v128.load (global.get $I8_DATA_U))))
  (func (export "extract_lane_10_i8_u") (result i32) (i8x16.extract_lane_u 10 (v128.load (global.get $I8_DATA_U))))
  (func (export "extract_lane_11_i8_u") (result i32) (i8x16.extract_lane_u 11 (v128.load (global.get $I8_DATA_U))))
  (func (export "extract_lane_12_i8_u") (result i32) (i8x16.extract_lane_u 12 (v128.load (global.get $I8_DATA_U))))
  (func (export "extract_lane_13_i8_u") (result i32) (i8x16.extract_lane_u 13 (v128.load (global.get $I8_DATA_U))))
  (func (export "extract_lane_14_i8_u") (result i32) (i8x16.extract_lane_u 14 (v128.load (global.get $I8_DATA_U))))
  (func (export "extract_lane_15_i8_u") (result i32) (i8x16.extract_lane_u 15 (v128.load (global.get $I8_DATA_U))))

  ;; i8x16 signed
  (func (export "extract_lane_0_i8_s")  (result i32) (i8x16.extract_lane_s 0  (v128.load (global.get $I8_DATA_S))))
  (func (export "extract_lane_1_i8_s")  (result i32) (i8x16.extract_lane_s 1  (v128.load (global.get $I8_DATA_S))))
  (func (export "extract_lane_2_i8_s")  (result i32) (i8x16.extract_lane_s 2  (v128.load (global.get $I8_DATA_S))))
  (func (export "extract_lane_3_i8_s")  (result i32) (i8x16.extract_lane_s 3  (v128.load (global.get $I8_DATA_S))))
  (func (export "extract_lane_4_i8_s")  (result i32) (i8x16.extract_lane_s 4  (v128.load (global.get $I8_DATA_S))))
  (func (export "extract_lane_5_i8_s")  (result i32) (i8x16.extract_lane_s 5  (v128.load (global.get $I8_DATA_S))))
  (func (export "extract_lane_6_i8_s")  (result i32) (i8x16.extract_lane_s 6  (v128.load (global.get $I8_DATA_S))))
  (func (export "extract_lane_7_i8_s")  (result i32) (i8x16.extract_lane_s 7  (v128.load (global.get $I8_DATA_S))))
  (func (export "extract_lane_8_i8_s")  (result i32) (i8x16.extract_lane_s 8  (v128.load (global.get $I8_DATA_S))))
  (func (export "extract_lane_9_i8_s")  (result i32) (i8x16.extract_lane_s 9  (v128.load (global.get $I8_DATA_S))))
  (func (export "extract_lane_10_i8_s") (result i32) (i8x16.extract_lane_s 10 (v128.load (global.get $I8_DATA_S))))
  (func (export "extract_lane_11_i8_s") (result i32) (i8x16.extract_lane_s 11 (v128.load (global.get $I8_DATA_S))))
  (func (export "extract_lane_12_i8_s") (result i32) (i8x16.extract_lane_s 12 (v128.load (global.get $I8_DATA_S))))
  (func (export "extract_lane_13_i8_s") (result i32) (i8x16.extract_lane_s 13 (v128.load (global.get $I8_DATA_S))))
  (func (export "extract_lane_14_i8_s") (result i32) (i8x16.extract_lane_s 14 (v128.load (global.get $I8_DATA_S))))
  (func (export "extract_lane_15_i8_s") (result i32) (i8x16.extract_lane_s 15 (v128.load (global.get $I8_DATA_S))))

  ;; i16x8 unsigned
  (func (export "extract_lane_0_i16_u") (result i32) (i16x8.extract_lane_s 0 (v128.load (global.get $I16_DATA_U))))
  (func (export "extract_lane_1_i16_u") (result i32) (i16x8.extract_lane_s 1 (v128.load (global.get $I16_DATA_U))))
  (func (export "extract_lane_2_i16_u") (result i32) (i16x8.extract_lane_s 2 (v128.load (global.get $I16_DATA_U))))
  (func (export "extract_lane_3_i16_u") (result i32) (i16x8.extract_lane_s 3 (v128.load (global.get $I16_DATA_U))))
  (func (export "extract_lane_4_i16_u") (result i32) (i16x8.extract_lane_s 4 (v128.load (global.get $I16_DATA_U))))
  (func (export "extract_lane_5_i16_u") (result i32) (i16x8.extract_lane_s 5 (v128.load (global.get $I16_DATA_U))))
  (func (export "extract_lane_6_i16_u") (result i32) (i16x8.extract_lane_s 6 (v128.load (global.get $I16_DATA_U))))
  (func (export "extract_lane_7_i16_u") (result i32) (i16x8.extract_lane_s 7 (v128.load (global.get $I16_DATA_U))))

  ;; i16x8 signed
  (func (export "extract_lane_0_i16_s") (result i32) (i16x8.extract_lane_s 0 (v128.load (global.get $I16_DATA_S))))
  (func (export "extract_lane_1_i16_s") (result i32) (i16x8.extract_lane_s 1 (v128.load (global.get $I16_DATA_S))))
  (func (export "extract_lane_2_i16_s") (result i32) (i16x8.extract_lane_s 2 (v128.load (global.get $I16_DATA_S))))
  (func (export "extract_lane_3_i16_s") (result i32) (i16x8.extract_lane_s 3 (v128.load (global.get $I16_DATA_S))))
  (func (export "extract_lane_4_i16_s") (result i32) (i16x8.extract_lane_s 4 (v128.load (global.get $I16_DATA_S))))
  (func (export "extract_lane_5_i16_s") (result i32) (i16x8.extract_lane_s 5 (v128.load (global.get $I16_DATA_S))))
  (func (export "extract_lane_6_i16_s") (result i32) (i16x8.extract_lane_s 6 (v128.load (global.get $I16_DATA_S))))
  (func (export "extract_lane_7_i16_s") (result i32) (i16x8.extract_lane_s 7 (v128.load (global.get $I16_DATA_S))))

  ;; i32x4
  (func (export "extract_lane_0_i32") (result i32) (i32x4.extract_lane 0 (v128.load (global.get $I32_DATA))))
  (func (export "extract_lane_1_i32") (result i32) (i32x4.extract_lane 1 (v128.load (global.get $I32_DATA))))
  (func (export "extract_lane_2_i32") (result i32) (i32x4.extract_lane 2 (v128.load (global.get $I32_DATA))))
  (func (export "extract_lane_3_i32") (result i32) (i32x4.extract_lane 3 (v128.load (global.get $I32_DATA))))

  ;; i64x2
  (func (export "extract_lane_0_i64") (result i64) (i64x2.extract_lane 0 (v128.load (global.get $I64_DATA))))
  (func (export "extract_lane_1_i64") (result i64) (i64x2.extract_lane 1 (v128.load (global.get $I64_DATA))))

  ;; f32x4
  (func (export "extract_lane_0_f32") (result f32) (f32x4.extract_lane 0 (v128.load (global.get $F32_DATA))))
  (func (export "extract_lane_1_f32") (result f32) (f32x4.extract_lane 1 (v128.load (global.get $F32_DATA))))
  (func (export "extract_lane_2_f32") (result f32) (f32x4.extract_lane 2 (v128.load (global.get $F32_DATA))))
  (func (export "extract_lane_3_f32") (result f32) (f32x4.extract_lane 3 (v128.load (global.get $F32_DATA))))

  ;; f64x2
  (func (export "extract_lane_0_f64") (result f64) (f64x2.extract_lane 0 (v128.load (global.get $F64_DATA))))
  (func (export "extract_lane_1_f64") (result f64) (f64x2.extract_lane 1 (v128.load (global.get $F64_DATA))))

  ;; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  ;; Replace lane
  ;; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  ;; i8x16
  (func (export "replace_lane_0_i8")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i8x16.replace_lane  0 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_1_i8")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i8x16.replace_lane  1 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_2_i8")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i8x16.replace_lane  2 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_3_i8")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i8x16.replace_lane  3 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_4_i8")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i8x16.replace_lane  4 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_5_i8")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i8x16.replace_lane  5 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_6_i8")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i8x16.replace_lane  6 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_7_i8")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i8x16.replace_lane  7 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_8_i8")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i8x16.replace_lane  8 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_9_i8")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i8x16.replace_lane  9 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_10_i8")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i8x16.replace_lane 10 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_11_i8")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i8x16.replace_lane 11 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_12_i8")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i8x16.replace_lane 12 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_13_i8")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i8x16.replace_lane 13 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_14_i8")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i8x16.replace_lane 14 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_15_i8")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i8x16.replace_lane 15 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )

  ;; i16x8
  (func (export "replace_lane_0_i16")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i16x8.replace_lane 0 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_1_i16")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i16x8.replace_lane 1 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_2_i16")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i16x8.replace_lane 2 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_3_i16")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i16x8.replace_lane 3 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_4_i16")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i16x8.replace_lane 4 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_5_i16")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i16x8.replace_lane 5 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_6_i16")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i16x8.replace_lane 6 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_7_i16")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i16x8.replace_lane 7 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )

  ;; i32x4
  (func (export "replace_lane_0_i32")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i32x4.replace_lane 0 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_1_i32")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i32x4.replace_lane 1 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_2_i32")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i32x4.replace_lane 2 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_3_i32")
        (param $new_val i32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i32x4.replace_lane 3 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )

  ;; i64x2
  (func (export "replace_lane_0_i64")
        (param $new_val i64)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i64x2.replace_lane 0 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_1_i64")
        (param $new_val i64)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (i64x2.replace_lane 1 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )

  ;; f32x4
  (func (export "replace_lane_0_f32")
        (param $new_val f32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (f32x4.replace_lane 0 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_1_f32")
        (param $new_val f32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (f32x4.replace_lane 1 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_2_f32")
        (param $new_val f32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (f32x4.replace_lane 2 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_3_f32")
        (param $new_val f32)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR)
      (f32x4.replace_lane 3 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )

  ;; f64x2
  (func (export "replace_lane_0_f64")
        (param $new_val f64)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR) (f64x2.replace_lane 0 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "replace_lane_1_f64")
        (param $new_val f64)
        (result i32 i32)
    (v128.store
      (global.get $OUTPUT_PTR) (f64x2.replace_lane 1 (v128.load (global.get $V128_DATA)) (local.get $new_val))
    )
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )

  ;; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  ;; Integer Addition
  ;; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  (func (export "add_i8") (param $arg1 i32) (param $arg2 i32) (result i32 i32)
    (v128.store (global.get $OUTPUT_PTR) (i8x16.add (v128.load (local.get $arg1)) (v128.load (local.get $arg2))))
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "add_i16") (param $arg1 i32) (param $arg2 i32) (result i32 i32)
    (v128.store (global.get $OUTPUT_PTR) (i16x8.add (v128.load (local.get $arg1)) (v128.load (local.get $arg2))))
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "add_i32") (param $arg1 i32) (param $arg2 i32) (result i32 i32)
    (v128.store (global.get $OUTPUT_PTR) (i32x4.add (v128.load (local.get $arg1)) (v128.load (local.get $arg2))))
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "add_i64") (param $arg1 i32) (param $arg2 i32) (result i32 i32)
    (v128.store (global.get $OUTPUT_PTR) (i64x2.add (v128.load (local.get $arg1)) (v128.load (local.get $arg2))))
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )

  ;; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  ;; Integer Subtraction
  ;; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  (func (export "sub_i8") (param $arg1 i32) (param $arg2 i32) (result i32 i32)
    (v128.store (global.get $OUTPUT_PTR) (i8x16.sub (v128.load (local.get $arg1)) (v128.load (local.get $arg2))))
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "sub_i16") (param $arg1 i32) (param $arg2 i32) (result i32 i32)
    (v128.store (global.get $OUTPUT_PTR) (i16x8.sub (v128.load (local.get $arg1)) (v128.load (local.get $arg2))))
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "sub_i32") (param $arg1 i32) (param $arg2 i32) (result i32 i32)
    (v128.store (global.get $OUTPUT_PTR) (i32x4.sub (v128.load (local.get $arg1)) (v128.load (local.get $arg2))))
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "sub_i64") (param $arg1 i32) (param $arg2 i32) (result i32 i32)
    (v128.store (global.get $OUTPUT_PTR) (i64x2.sub (v128.load (local.get $arg1)) (v128.load (local.get $arg2))))
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )

  ;; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  ;; Integer Multiplication
  ;; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  (func (export "mul_i16") (param $arg1 i32) (param $arg2 i32) (result i32 i32)
    (v128.store (global.get $OUTPUT_PTR) (i16x8.mul (v128.load (local.get $arg1)) (v128.load (local.get $arg2))))
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "mul_i32") (param $arg1 i32) (param $arg2 i32) (result i32 i32)
    (v128.store (global.get $OUTPUT_PTR) (i32x4.mul (v128.load (local.get $arg1)) (v128.load (local.get $arg2))))
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
  (func (export "mul_i64") (param $arg1 i32) (param $arg2 i32) (result i32 i32)
    (v128.store (global.get $OUTPUT_PTR) (i64x2.mul (v128.load (local.get $arg1)) (v128.load (local.get $arg2))))
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )

  ;; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  ;; Integer dot product
  ;; - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  (func (export "dot_i16") (param $arg1 i32) (param $arg2 i32) (result i32 i32)
    (v128.store (global.get $OUTPUT_PTR) (i32x4.dot_i16x8_s (v128.load (local.get $arg1)) (v128.load (local.get $arg2))))
    (global.get $OUTPUT_PTR)
    (i32.const 16)
  )
)
