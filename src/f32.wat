(module
  (memory (export "memory") 1)

  ;; Return the hardcoded value stored in JavaScript's Math.PI constant
  (func (export "f32_hardcoded")
        (result f32)
    (f32.const 3.141592653589793)
  )

  ;; Echo supplied f32 value back to caller
  (func (export "f32_echo")
        (param $f32_arg f32)
        (result f32)
    (local.get $f32_arg)
  )

  ;; Return f32 value read from shared memory
  (func (export "f32_from_memory")
        (param $f32_ptr  i32)
        (result f32)
    (f32.load (local.get $f32_ptr))
  )
)
