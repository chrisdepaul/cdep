const GenerateKSP = require('./generator.js').default;

export const createKSP = (config) => {
    const ksp = new GenerateKSP(config)
    ksp.writeCode(JSON.stringify(config))
}