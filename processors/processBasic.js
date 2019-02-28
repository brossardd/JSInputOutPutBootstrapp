'use strict'
const _ = require('lodash'),
    R = require('ramda'),
    computeScore = require('../modules/scoreFunction.js'),
    tag = "processBasic";


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

    for (let i = 0; i < verticalPhotos.length; i+=2) {
        if (!!verticalPhotos[i+1]) {
            outputObject.slides = outputObject.slides.concat(createSlide([verticalPhotos[i], verticalPhotos[i+1]]));
        } else {
            outputObject.slides = outputObject.slides.concat(createSlide([verticalPhotos[i]]));
        }
    }

    let count = 0;
    let { slides } = outputObject;
    const scoreBefore = internalComputeScore(slides);

    slides = slides.sort((s1, s2) => s1.tags[0] > s2.tags[0]);

    while (count < slides.length * 4) {
        const index1 = Math.floor(Math.random()*slides.length);
        const index2 = Math.floor(Math.random()*slides.length);
        if (index1 !== index2) {
            const currentScore = internalComputeScore(getPartialSlideShow(slides, index1, index2));
            const permutedSlides = permute(slides, index1, index2);
            const currentScoreAfterPermut = internalComputeScore(getPartialSlideShow(permutedSlides, index1, index2));
            if (currentScoreAfterPermut > currentScore) {
                slides = permutedSlides;
            }
            count++;
        }
    }

    console.log(`Score before = ${scoreBefore}`);
    outputObject.slides = slides;

    return {
        score: computeScore(inputObject, outputObject),
        outputObject
    };
}

function getPartialSlideShow(slides, index1, index2) {
    const partialSlidesArray = [];
    const indexArray = [index1 - 1, index1, index1 + 1, index2 - 1, index2, index2 + 1].filter(idx => {
        return idx >= 0 && idx <= slides.length - 1;
    });

    new Set(indexArray).forEach(idx => {
        partialSlidesArray.push(slides[idx]);
    });

    return partialSlidesArray;
}

function permute(slides, index1, index2){
    const newSlides = slides.concat([]);
    const temp = newSlides[index1];
    newSlides[index1] = newSlides[index2];
    newSlides[index2] = temp;
    return newSlides;
}

function internalComputeScore(slides) {
    let score = 0;
    const nbIntersec = slides.length - 1;
  
    for (let i = 0; i < nbIntersec; i++) {
      const prevSlideTags = extractTags(slides[i]);
      const nextSlideTags = extractTags(slides[i+1]);
      const commonTags = intersecTags(prevSlideTags, nextSlideTags);
      const uniqTagsPrevSlide = diffTags(prevSlideTags, commonTags);
      const uniqTagsNextSlide = diffTags(nextSlideTags, commonTags);
      const minTagsNb = Math.min(commonTags.length, uniqTagsPrevSlide.length, uniqTagsNextSlide.length);
      score += minTagsNb;
    }
  
    return score;
}

function extractTags({photos}) {
    let tags = {};
    for(const p of photos) {
      for(const t of p.tags) {
        tags[t] = t;
      }
    }
    return Object.keys(tags);
  }
  
function intersecTags(tags1, tags2) {
    const inter = [];
    for(const t of tags1) {
      if(tags2.indexOf(t) !== -1) {
        inter.push(t);
      }
    }
    return inter;
}
  
function diffTags(base, minus) {
    return base.filter(t => minus.indexOf(t) === -1);
}


function createSlide(photos) {
    return {
        tags : new Set(photos.map(p => releaseEvents.tags).join()).sort((t1, t2) => t1 > t2),
        photos
    };
}

module.exports = processInput;