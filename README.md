A command-line interface to generate KSP starter scripts for Kontakt.

# Install

`npm install cdep -g`

# Usage

In terminal, launch the generator

`cdep generate`

Answer the series of prompts to generate the KSP script. The output is saved as a `.ksp` file on your Desktop.

Copy and paste the code into the Kontakt script editor.

Note: The generated script is designed to handle the boiler plate script in order to get you scripting the more exciting parts of your instrument.

# Features
 
As of Version 1.0, cdep can generate: 

* Knobs
* Sliders
* Associate a handful of ENGINE_PAR effects to the components
* Custom Slider Graphics
* Place the components into a grid
* Set up modifier keys on the keyboard

The tool will ask about Groups and Slots that the component should be associated with. To get the most of the tool, have a decent idea about how these parameters work.

# References
[KSP Reference Guide](https://www.native-instruments.com/fileadmin/ni_media/downloads/manuals/KSP_5.7_Reference_Manual_0917.pdf)