const inquirer = require('inquirer')
const { keys } = require('ramda')
const rk = require('randomkey')
const q = require('./questions')
const { config } = require('./instrumentConfig.js')
const { UI_FUNCTIONS } = require('./componentConstants.js')

const { createKSP } = require('../generator');


/**
 * Launch questions
 */
export const launch = () => {
    askInstrumentName();
}

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
                        variableName: `$${response.componentName}`,
                        componentFunction: UI_FUNCTIONS[response.componentFunction],
                        min: response.componentMin,
                        max: response.componentMax
                    }
                })
            })
        })
    })

    chain.then(() => {
        createKSP(config)
    })
}