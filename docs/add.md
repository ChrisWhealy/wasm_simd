# Add

Adding integers is simply a matter of supplying two vectors of the same shape.
The resulting sum is left on the stack.

In the simplest case, vector addition for an `i8`-shaped vector is just this

```wast
(func $vector_add_i8
      (param $arg1 v128)
      (param $arg2 v128)
      (result v128)
  (i8x16.add
    (local.get $arg1)
    (local.get $arg2)
  )
)
```

## But What about Overflow?

If you use any of the `<shape>.add` instructions, arithmetic overflows are simply ignored.
