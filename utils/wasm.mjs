import { readFileSync } from 'fs'

export const startWasmModule =
  async (pathToWasmFile, hostEnv) => {
    let wasmObj = await WebAssembly.instantiate(readFileSync(pathToWasmFile), hostEnv)
    return wasmObj.instance
  }
