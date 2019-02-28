'use strict'
const _ = require('lodash'),
    R = require('ramda'),
    computeScore = require('../modules/scoreFunction.js');


/**
 *
 * @typedef ReturnProcess
 * @property {number} score
 * @property {Object} outputObject
 *
 * @param {Object} inputObject
 * @return {ReturnProcess}
 */
function processInput(inputObject){
    const outputObject = {};

    outputObject.slides = [];


    return {
        score: computeScore(inputObject, outputObject),
        outputObject
    };
}

function createSlide(photos) {
    return {
        photos
    };
}

module.exports = processInput;