const { keys } = require('ramda')
const { UI_COMPONENTS, UI_FUNCTIONS, KNOB_UNIT } = require('./componentConstants.js')

export const askInstrumentNameQ = [
    {
        type: 'input',
        name: 'instrumentName',
        message: 'What\'s the instrument\'s name?',
        validate: requireInput
    }
]

export const askUIComponentsQ = [
    {
        type: 'checkbox',
        name: 'uiComponents',
        message: 'Select the UI components you want...',
        choices: () => keys(UI_COMPONENTS).map(key => UI_COMPONENTS[key])
    }
]

export const getUIComponentQuantityQuestion = (component) => {
    return [
        {
            type: 'input',
            name: `numberOfComponent`,
            message: `How many ${component} do you want?`,
            validate: requireInput
        }
    ]
}

export const getUIComponentDetailQuestion = (component, index) => {
    const comp = component.slice(0, -1)
    return [
        {
            type: 'input',
            name: `componentName`,
            message: `Name ${comp} ${index + 1}:`,
            default: `${comp}${index + 1}`
        },
        {
            type: 'list',
            name: `componentFunction`,
            message: `What's the function of this ${comp}?`,
            choices: () => keys(UI_FUNCTIONS).map(key => key)
        },
        {
            type: 'list',
            name: `unit`,
            message: `What's the unit of this ${comp}?`,
            choices: () => keys(KNOB_UNIT).map(key => key),
            when: () => comp == 'knob'
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
        {
            type: 'input',
            name: `group`,
            message: `Set the group index:`,
            default: '0'
        },
        {
            type: 'input',
            name: `slot`,
            message: `Set the slot index:`,
            default: '0'
        },
    ]
}

export const askUIHeightQ = [
    {
        type: 'input',
        name: 'uiHeight',
        message: 'What\'s the UI height?',
        default: '330'
    }
]

const requireInput = (input) => {
    return input ? true : 'Response can\'t be empty'
}