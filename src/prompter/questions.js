import { UI_FUNCTIONS_SELECTION_NAMES } from './componentConstants.js';

const { keys, values, isEmpty } = require('ramda')
const { UI_COMPONENTS, UI_FUNCTIONS, KNOB_UNIT, OTHER_COMPONENTS } = require('./componentConstants.js')

export const askInstrumentNameQ = [
    {
        type: 'input',
        name: 'instrumentName',
        message: 'What\'s the instrument\'s name?',
        validate: (input) => isEmpty(input) ? 'Must provide name' : true
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
            choices: () => values(UI_FUNCTIONS_SELECTION_NAMES).map(key => key)
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
            name: `default`,
            message: `Set the default setting:`,
            default: '0'
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

export const askOtherComponentsQ = [
    {
        type: 'checkbox',
        name: 'otherComponents',
        message: 'Do you want additional components?',
        choices: () => keys(OTHER_COMPONENTS).map(key => OTHER_COMPONENTS[key])
    }
]


export const askModifierKeysDetailsQ = [
    {
        type: 'input',
        name: 'modifier_first',
        message: 'first modifier key:',
        default: '1'
    },
    {
        type: 'input',
        name: 'modifier_last',
        message: 'last modifier key:',
        default: '12'
    }
]

export const askPlaceComponentsQ = [
    {
        type: 'list',
        name: 'placeComponents',
        message: 'Place the compoments in a grid?',
        choices: ['yes', 'no'],
        filter: (input) => input === 'yes' ? true : false
    }
]

export const askCustomGraphicsQ = [
    {
        type: 'list',
        name: 'customGraphics',
        message: 'Use custom graphics?',
        choices: ['yes', 'no'],
        filter: (input) => input === 'yes' ? true : false
    }
]

export const askUIHeightQ = [
    {
        type: 'input',
        name: 'uiHeight',
        message: 'What\'s the UI height?',
        default: '330'
    }
]

const requireInput = (input) => {
    return isEmpty(input) ? 'Response can\'t be empty' : true
}