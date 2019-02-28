'use strict'


/**
 * Compute some additionnal commons calculation do add to the final object
 * The original object is not touch 
 * This method is only execute once !
 * 
 * @param {Object} parseResult 
 * @returns {Object} the transform object
 */
function finalParseOperation(parseResult) {
    // We copy the object
    const finalObject = {...parseResult};

    /**
     * Code Goes Here ▼
     */
    const horizontal = parseResult.photos.filter(photo => photo.orientation === 'H');
    const vertical = parseResult.photos.filter(photo => photo.orientation === 'V');

    finalObject.horizontalPhotos = horizontal;
    finalObject.verticalPhotos = vertical;


    console.log(JSON.stringify(finalObject));
    return finalObject;
}
module.exports = finalParseOperation;