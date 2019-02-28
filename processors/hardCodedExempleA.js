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

    outputObject.slides = [
      {photos: [{id: 0, tags: ['cat', 'beach', 'sun']}]},
      {photos: [{id: 3, tags: ['garden', 'cat']}]},
      {photos: [{id: 1, tags: ['selfie', 'smile']}, {id: 2, tags: ['garden', 'selfie']}]},
    ];


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
