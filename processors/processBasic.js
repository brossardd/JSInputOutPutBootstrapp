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
    const {horizontalPhotos, verticalPhotos} = inputObject;

    outputObject.slides = [];

    outputObject.slides = outputObject.slides.concat(horizontalPhotos.map(photo => createSlide([photo])));

    for (let i = 0; i++; i < verticalPhotos.length) {
        if (!!verticalPhotos[i+1]) {
            outputObject.slides = outputObject.slides.concat(createSlide([verticalPhotos[i], verticalPhotos[i+1]]));
        } else {
            outputObject.slides = outputObject.slides.concat(createSlide([verticalPhotos[i]]));
        }
        i++;
    }

    console.log(outputObject);

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

function permute(slides, index1, index2){
    const temp = slides[index1];
    slides[index1] = slides[index2];
    slides[index2] = temp;
}

module.exports = processInput;