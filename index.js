const program = require('commander')
const inquirer = require('inquirer')
const { keys, values } = require('ramda')
const rk = require('randomkey')

const config = {}

const UI_COMPONENTS = {
    KNOBS: 'knobs',
    SLIDERS: 'sliders'
}

const UI_FUNCTIONS = {
    ACTION: 'action',
    DECAY: 'decay',
    SUSTAIN: 'sustain',
    RELEASE: 'release'
}

const askInstrumentNameQ = [
    {
        type: 'input',
        name: 'instrumentName',
        message: 'What\'s the instrument\'s name?'
    }
]

const askUIComponentsQ = [
    {
        type: 'checkbox',
        name: 'uiComponents',
        message: 'Select the UI components you want...',
        choices: () => keys(UI_COMPONENTS).map(key => UI_COMPONENTS[key])
    }
]

const getUIComponentQuantityQuestion = (component) => {
    return [
        {
            type: 'input',
            name: `numberOfComponent`,
            message: `How many ${component} do you want?`
        }
    ]
}

const getUIComponentDetailQuestion = (component, index) => {
    const comp = component.slice(0, -1)
    return [
        {
            type: 'input',
            name: `componentName`,
            message: `Name ${comp} ${index + 1}:`,
            default: `${comp} ${index + 1}`
        },
        {
            type: 'list',
            name: `componentFunction`,
            message: `What's the function of this ${comp}?`,
            choices: () => keys(UI_FUNCTIONS).map(key => UI_FUNCTIONS[key])
        },
        {
            type: 'input',
            name: `componentMin`,
            message: `Set the minimum function setting:`,
            default: '0'
        },
        {
            type: 'input',
            name: `componentMax`,
            message: `Set the maximum function setting:`,
            default: '100000'
        },
    ]
}

/**
 * Input: Ask the name of the instrument
 */
const askInstrumentName = () => {
    inquirer.prompt(askInstrumentNameQ).then(response => {
        config.instrumentName = response.instrumentName
        askUIComponents()
    })
}

/**
 * List: Ask which UI components to include
 */
const askUIComponents = () => {
    inquirer.prompt(askUIComponentsQ).then(response => {
        config.uiComponents = {}
        response.uiComponents.forEach(comp => {            
            config.uiComponents[comp] = {}
        })
        askUIComponentsDetails()
    })
}

const askUIComponentFeatures = (comp, i) => {
    const askUIComponentDetailQ = getUIComponentDetailQuestion(comp, i)
    return inquirer.prompt(askUIComponentDetailQ).then(response => {
        const key = rk(3)
        config.uiComponents[comp][key] = {
            name: response.componentName,
            componentFunction: response.componentFunction,
            min: response.componentMin,
            max: response.componentMax
        }
    })
}

const askUIComponentQuantity = (comp) => {
    return inquirer.prompt(
        getUIComponentQuantityQuestion(comp)
    )
}

const askUIComponentsDetails = () => {
    // For each UI component, ask how many, the name of each, function, min, max
    let keysComp = keys(config.uiComponents)
    let chain = Promise.resolve()

    for (let i = 0; i < keysComp.length; i++) {
        console.log(keysComp[i])
        chain = chain.then(function () {
            return askUIComponentQuantity(keysComp[i])
        })
    }
    /*
    askUIComponentQuantity(keysComp[index])
        .then()
    while (index < keysComp.length) {
        let comp = keysComp[index]
        askUIComponentQuantity()
        askUIComponentFeatures(comp, i)
        
    }



    keys(config.uiComponents).forEach(comp => {
        const askUIComponentQuantityQ = getUIComponentQuantityQuestion(comp)
        inquirer.prompt(askUIComponentQuantityQ).then(response => {
            const numberOfComponent = response.numberOfComponent
            for (let i = 0; i < numberOfComponent; i++) {
                const askUIComponentDetailQ = getUIComponentDetailQuestion(comp, i)
                inquirer.prompt(askUIComponentDetailQ).then(response => {
                    const key = rk(3)
                    config.uiComponents[comp][key] = {
                        name: response.componentName,
                        componentFunction: response.componentFunction,
                        min: response.componentMin,
                        max: response.componentMax
                    }
                })
            }
        })
    })
    */
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
