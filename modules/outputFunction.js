'use strict'
const _ = require('lodash'),
    R = require('ramda');


/**
 * Transform an output object to a list of string. Each string will be write into an output file
 * This method is only execute Once
 * 
 * @param {Array} objectToConvert
 * @returns {Array<String>}
 */
function convert(outputObject){
    /**@type {Array<String>} */
    const instructions = [];

    /**
     * Code Goes Here ▼
     */
    const { slides } = outputObject;
    instructions.push(slides.length);
    
    slides.forEach(slide => {
        instructions.push(slide.photos.map(photos => photos.id).join(' '));
    });

    return instructions;
}


module.exports = convert;