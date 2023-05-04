export const arrayEq = (a1, a2) =>
  a1.reduce((acc, a1El, idx) => (_ => acc)(acc.push(a1El === a2[idx])), [])
    .every(el => el)
