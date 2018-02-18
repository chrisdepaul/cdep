const inquirer = require('inquirer')
const { keys, invert, pathOr, isEmpty } = require('ramda')
const rk = require('randomkey')
const q = require('./questions')
const { config } = require('./instrumentConfig.js')
const { UI_FUNCTIONS, KNOB_UNIT, UI_FUNCTIONS_SELECTION_NAMES, OTHER_COMPONENTS } = require('./componentConstants.js')

const { createKSP } = require('../generator');


/**
 * Launch questions
 */
export const launch = () => {
    nextQuestion.ask()
}

/**
 * Input: Ask the name of the instrument
 */
const askInstrumentName = () => {
    inquirer.prompt(q.askInstrumentNameQ).then(response => {
        config.instrumentName = response.instrumentName
        nextQuestion.ask()
    })
}

/**
 * List: Ask which UI components to include
 */
const askUIComponents = () => {
    inquirer.prompt(q.askUIComponentsQ).then(response => {
        if (!isEmpty(pathOr(false, ['uiComponents'], response))) {
            config.uiComponents = {}
            response.uiComponents.forEach(comp => {            
                config.uiComponents[comp] = {}
            })
        }
        nextQuestion.ask()
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
    chain.then(nextQuestion.ask)
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
                        componentFunction: UI_FUNCTIONS[invert(UI_FUNCTIONS_SELECTION_NAMES)[response.componentFunction]],
                        unit: KNOB_UNIT[response.unit],
                        min: response.componentMin,
                        max: response.componentMax,
                        default: response.default,
                        group: response.group,
                        slot: response.slot
                    }
                })
            })
        })
    })

    chain.then(() => {
        nextQuestion.ask()
    })
}

const askOtherComponents = () => {
    let chain = Promise.resolve()
    chain = chain.then(() => {
        return inquirer.prompt(q.askOtherComponentsQ).then(response => {
            if (!isEmpty(pathOr(false, ['otherComponents'], response))) {
                config.otherComponents = {}
                response.otherComponents.forEach(comp => {            
                    config.otherComponents[invert(OTHER_COMPONENTS)[comp][0]] = {}
                })
            }
        })
    })

    // Call next question series
    chain.then(nextQuestion.ask)
}

const askOtherComponentsDetails = () => {
    const compList = keys(config.otherComponents)
    let chain = Promise.resolve()

    compList.forEach((comp, i) => {
        // Ask about Modifier Keys
        if(comp == 'modifierKeys') {
            chain = chain.then(() => {
                return inquirer.prompt(q.askModifierKeysDetailsQ).then(response => {
                    config.otherComponents.modifierKeys.first = response.modifier_first
                    config.otherComponents.modifierKeys.last = response.modifier_last
                })
            })
        }
    })
    // Call next question series
    chain.then(nextQuestion.ask)
}

/**
 * Input: Place components in grid
 */
const askPlaceComponents = () => {
    const compList = keys(config.uiComponents)
    let chain = Promise.resolve()
    if(!isEmpty(compList)) {
        chain = chain.then(() => {
            return inquirer.prompt(q.askPlaceComponentsQ).then(response => {
                config.placeComponents = response.placeComponents
            }) 
        })
    }

    // Call next question series
    chain.then(nextQuestion.ask)
}

/**
 * Input: Use custome graphics
 */
const askCustomGraphics = () => {
    const compList = keys(config.uiComponents)
    let chain = Promise.resolve()
    if(!isEmpty(compList)) {
        chain = chain.then(() => {
            return inquirer.prompt(q.askCustomGraphicsQ).then(response => {
                config.customGraphics = response.customGraphics
            })
        })
    }

    // Call next question series
    chain.then(nextQuestion.ask)
}

/**
 * Input: Ask the size of the instrument view
 */
const askUIHeight = () => {
    let chain = Promise.resolve()
    chain = chain.then(() => {
        return inquirer.prompt(q.askUIHeightQ).then(response => {
            config.uiHeight = response.uiHeight
        })
    })

    // Call next question series
    chain.then(nextQuestion.ask)
}

/** 
 * Set the order of questions to ask
*/
const questionController = () => {
    let index = 0;
    const askQuestion = [
        askInstrumentName,
        askUIComponents,
        askUIComponentsQuantity,
        askUIComponentDetails,
        askOtherComponents,
        askOtherComponentsDetails,
        askPlaceComponents,
        askCustomGraphics,
        askUIHeight,
    ];

    return {
        ask: () => {
            if(askQuestion[index]) {
                askQuestion[index]()
                index++
            } else {
                createKSP(config)
            }
        }
    } 
}

const nextQuestion = new questionController()
