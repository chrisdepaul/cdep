const program = require('commander')
const inquirer = require('inquirer')
const { keys } = require('ramda')
const rk = require('randomkey')
const q = require('./questions')
const { config } = require('./instrumentConfig.js')

/**
 * Input: Ask the name of the instrument
 */
const askInstrumentName = () => {
    inquirer.prompt(q.askInstrumentNameQ).then(response => {
        config.instrumentName = response.instrumentName
        askUIComponents()
    })
}

/**
 * List: Ask which UI components to include
 */
const askUIComponents = () => {
    inquirer.prompt(q.askUIComponentsQ).then(response => {
        config.uiComponents = {}
        response.uiComponents.forEach(comp => {            
            config.uiComponents[comp] = {}
        })
        askUIComponentsQuantity()
    })
}

/** 
 * For each UI component, ask how many
*/
const askUIComponentsQuantity = () => {
    // For each UI component, ask how many, the name of each, function, min, max
    let keysComp = keys(config.uiComponents)
    let chain = Promise.resolve()

    keysComp.forEach((comp, i) => {
        chain = chain.then(() => {
            return inquirer.prompt(
                q.getUIComponentQuantityQuestion(comp)
            ).then(response => {
                // Save component keys to config object
                for (let j = 0; j < response.numberOfComponent; j++) {
                    const key = rk(3)
                    config.uiComponents[comp][key] = {}
                }
            })
        })
    })

    // Call next question series
    chain.then(askUIComponentDetails)
}

/**
 * For each UI component, ask the name of each, function, min, max
*/
const askUIComponentDetails = () => {
    const compList = keys(config.uiComponents)
    let chain = Promise.resolve()

    compList.forEach((comp, i) => {
        const itemList = keys(config.uiComponents[comp])
        itemList.forEach((item, j) => {
            const askUIComponentDetailQ = q.getUIComponentDetailQuestion(comp, j)
            chain = chain.then(() => {
                return inquirer.prompt(askUIComponentDetailQ).then(response => {
                    config.uiComponents[comp][item] = {
                        name: response.componentName,
                        componentFunction: response.componentFunction,
                        min: response.componentMin,
                        max: response.componentMax
                    }
                })
            })
        })
    })

    chain.then(() => {
        console.log('done!')
        console.log(config)
    })
}

/**
 * Run Program
 */
program
    .version('1.0.0')
    .description('Build Kontakt Script instruments')

program
    .command('generate')
    .alias('g')
    .description('Initiate the instrument generation')
    .action(askInstrumentName)

program.parse(process.argv)
