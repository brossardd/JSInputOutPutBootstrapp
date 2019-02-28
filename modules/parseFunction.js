'use strict'
const _ = require('lodash'),
    R = require('ramda');


/**
 * Transform a set of row to a javascript object
 * This method is only execute once
 *
 * @param {number} lineCount
 * @param {string} line
 * @param {Object} result
 */
function parse(lineCount, line, result){
    /**
     * Code Goes Here ▼
     */

    if (lineCount === 0){
        result.photosCount = +line;
        result.photos = [];
    } else {
        const [orientation, M, ...tags] = line.split(' ');
        const photo = {
            id: lineCount - 1,
            orientation: orientation,
            M: +M,
            tags: tags
        };
        result.photos.push(photo);
        
    }
}


module.exports = parse;
