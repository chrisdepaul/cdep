const GenerateKSP = require('./generator.js').default;
const { keys, path, pathOr } = require('ramda');

export const createKSP = (config) => {
    const ksp = new GenerateKSP(config)
    
    startOnInit(ksp, 0)
        initialization(ksp, config, 1)
        declareComponents(ksp, config, 1)
        customGraphics(ksp, config, 1)
        makePersistant(ksp, config, 1)
        readPersistant(ksp, config, 1)
    endOn(ksp, 0)

    generateOnUIControl(ksp, config, 0)

    generateOnNote(ksp, config, 0)

    ksp.closeFile()
}

const startOnInit = (ksp, tabLevel) => {
    ksp.writeCode('on init', tabLevel)
}

const endOn = (ksp,tabLevel) => {
    ksp.writeCode('end on', tabLevel)
}

const initialization = (ksp, config, tabLevel) => {
    ksp.writeCode(`message("")`, tabLevel)
    ksp.writeCode(`make_perfview`, tabLevel)	
    ksp.writeCode(`set_ui_height_px(${config.uiHeight})`, tabLevel)
    ksp.writeCode(`$last_played_note_id`, tabLevel)	
}

const declareComponents = (ksp, config, tabLevel) => {
    const uic = pathOr(false, ['uiComponents'], config);
    if(uic) {
        keys(uic).forEach((comp, j) => {
            ksp.writeComment(`Declare UI Components - ${comp}`, tabLevel)
            let uiArray = `%ui_${comp.slice(0, -1)}_id`
            let uiArrayLength =  keys(path([comp], uic)).length
            let id_array = []
            let units_array = []
            ksp.writeCode(`declare ${uiArray}[${uiArrayLength}]`, tabLevel)
            ksp.blankLine()
            keys(path([comp], uic)).forEach((key, i) => {
                const item = path([comp, key], uic)

                if (comp == 'knobs') {
                    ksp.writeCode(`declare ui_knob ${item.variableName} (${item.min}, ${item.max}, 1)`, tabLevel)
                } else if (comp == 'sliders') {
                    ksp.writeCode(`declare ui_slider ${item.variableName} (${item.min}, ${item.max})`, tabLevel)
                } else {
                    ksp.writeComment(`Error: Declaring UI`, tabLevel)
                }

                ksp.writeCode(`${uiArray}[${i}] := get_ui_id(${item.variableName})`, tabLevel)

                if (comp == 'knobs') {
                    ksp.writeCode(`set_knob_unit(${item.variableName}, ${item.unit})`, tabLevel)
                    ksp.writeCode(`set_knob_defval(${item.variableName}, ${item.default})`, tabLevel)
                }

                ksp.writeCode(`declare ${item.variableName}_group`, tabLevel)
                ksp.writeCode(`declare ${item.variableName}_slot`, tabLevel)
                ksp.writeCode(`${item.variableName}_group := ${item.group}`, tabLevel)
                ksp.writeCode(`${item.variableName}_slot := ${item.slot}`, tabLevel)
                ksp.writeCode(`${item.variableName} := get_engine_par(${item.componentFunction}, ${item.variableName}_group, ${item.variableName}_slot, -1)`, tabLevel)
                if (comp == 'knobs') {
                    ksp.writeCode(`set_knob_label(${item.variableName}, get_engine_par_disp(${item.componentFunction}, ${item.variableName}_group, ${item.variableName}_slot, -1))` , tabLevel)
                }
                if (config.placeComponents) {
                    ksp.writeCode(`move_control(${item.variableName}, ${i + 1}, ${j + 1})`, tabLevel)
                }
                ksp.blankLine()
            })
        });
    }
}

const customGraphics = (ksp, config, tabLevel) => {
    const slidersExist = pathOr(false, ['uiComponents', 'sliders'], config);
    const custom = path(['customGraphics'], config)
    if (slidersExist && custom) {
        ksp.writeComment(`Custom Slider (SlidingBlock image must exist on local machine)`, tabLevel)
        ksp.writeCode(`$count := 0`, tabLevel)
        ksp.writeCode(`while ($count < ${keys(config.uiComponents.slides).length})`, tabLevel)
            ksp.writeCode(`set_control_par_str(%ui_slider_id[$count],$CONTROL_PAR_PICTURE , "SlidingBlock")`, tabLevel + 1)
            ksp.writeCode(`set_control_par_str(%ui_slider_id[$count],$CONTROL_PAR_MOUSE_BEHAVIOUR , -1000)`, tabLevel + 1)
            ksp.writeCode(`set_control_par_str(%ui_slider_id[$count],$CONTROL_PAR_WIDTH , 59)`, tabLevel + 1)
            ksp.writeCode(`set_control_par_str(%ui_slider_id[$count],$CONTROL_PAR_HEIGHT , 108)`, tabLevel + 1)
            ksp.writeCode(`inc($count)`, tabLevel + 1)
        ksp.writeCode(`end while`, tabLevel)
    }    
}

const makePersistant = (ksp, config, tabLevel) => {
    const uic = pathOr(false, ['uiComponents'], config);
    if (uic) {
        ksp.writeComment(`Make Variable Persistant`, tabLevel)
        keys(uic).forEach((comp) => {
            keys(path([comp], uic)).forEach((key, i) => {
                const item = path([comp, key], uic)
                ksp.writeCode(`make_persistent(${item.variableName})`, tabLevel)
            })
        });
    }
}

const readPersistant = (ksp, config, tabLevel) => {
    const uic = pathOr(false, ['uiComponents'], config);
    if(uic) {
        ksp.writeComment(`Read Persistant Variable`, tabLevel)
        keys(uic).forEach((comp) => {
            keys(path([comp], uic)).forEach((key, i) => {
                const item = path([comp, key], uic)
                ksp.writeCode(`read_persistent_var(${item.variableName})`, tabLevel)
            })
        });
    }
}

const generateOnUIControl = (ksp, config, tabLevel) => {
    const uic = pathOr(false, ['uiComponents'], config);
    if (uic) {
        keys(uic).forEach((comp) => {
            keys(path([comp], uic)).forEach((key, i) => {
                const item = path([comp, key], uic)
                ksp.blankLine();
                ksp.writeCode(`on ui_control(${item.variableName})`, tabLevel)
                    ksp.writeCode(`declare $count := 0`, tabLevel + 1)
                    ksp.writeCode(`while ($count < $NUM_GROUPS)`, tabLevel + 1)
                        ksp.writeCode(`set_engine_par(${item.componentFunction}, ${item.variableName}, $count, ${item.variableName}_slot, -1)`, tabLevel + 2)
                        ksp.writeCode(`inc($count)`, tabLevel + 2)
                    ksp.writeCode(`end while`, tabLevel + 1)
                ksp.writeCode(`end on`, tabLevel)
            })
        });
    }
}

const generateOnNote = (ksp, config, tabLevel) => {
    const modifierKeys = pathOr(false, ['otherComponents', 'modifierKeys'], config);
    if (modifierKeys) {
        ksp.blankLine()
        ksp.writeCode(`on note`, tabLevel)
            ksp.writeComment(`Regular Key Range`, tabLevel + 1)
            ksp.writeCode(`if(not in_range($EVENT_NOTE, ${modifierKeys.first}, ${modifierKeys.last}))`, tabLevel + 1)
                ksp.writeCode(`$last_played_note_id := $EVENT_ID`, tabLevel + 2)
            ksp.writeCode(`end if`, tabLevel + 1)

            ksp.writeComment(`Modifier Key Range`, tabLevel + 1)
            ksp.writeCode(`if(in_range($EVENT_NOTE, ${modifierKeys.first}, ${modifierKeys.last}))`, tabLevel + 1)
                ksp.writeCode(`ignore_event($EVENT_ID)`, tabLevel + 2)
                ksp.writeComment(`PUT MODIFIER CODE HERE`, tabLevel + 2)
            ksp.writeCode(`end if`, tabLevel + 1)
        ksp.writeCode('end on', tabLevel)
    }
}