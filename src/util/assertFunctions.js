export default function assertFunctions(funcMap) {
  Object.keys(funcMap).forEach(funcName => {
    const func = funcMap[funcName]
    const funcType = typeof func
    if (funcType !== 'function') {
      throw new Error(`Expected ${funcName} to be of type 'function', not '${funcType}'`)
    }
  })
}
