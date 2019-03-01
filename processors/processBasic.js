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
    outputObject.slides = outputObject.slides.concat(computeVerticales(verticalPhotos));

    /*for (let i = 0; i < verticalPhotos.length; i+=2) {
        if (!!verticalPhotos[i+1]) {
            outputObject.slides = outputObject.slides.concat(createSlide([verticalPhotos[i], verticalPhotos[i+1]]));
        } else {
            outputObject.slides = outputObject.slides.concat(createSlide([verticalPhotos[i]]));
        }
    }*/

    let count = 0;
    let { slides } = outputObject;
    const scoreBefore = internalComputeScore(slides);
    const maxCount = slides.length < 200000 ? 200000 : slides.length;
    // slides = slides.sort(sortSlides);

    while (count < maxCount) {
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

function computeVerticales(photos) {
    const slides = [];
  
    while (photos.length > 0) {
      const cur = photos.shift();
      const extracted = extractSome(photos, 5);
      if (extracted.length === 0) {
        slides.push(createSlide([cur]));
      } else {
        const best = extracted[0];
        const bestTags = uniqTags(cur.tags, best.tags);
        for (let i = 0; i < extracted.length; i++) {
          const tags = uniqTags(cur.tags, extracted[i].tags);
          if (tags.length > bestTags.length) {
            best = extracted[i];
            bestTags = tags;
          }
        }
        const bestIndex = extracted.indexOf(best);
        extracted.splice(bestIndex, 1);
        extracted.forEach(p => photos.push(p));
        const slide = createSlide([cur, best]);
        slide.tags = bestTags;
        slides.push(slide);
      }
    }
  
    return slides;
}

function intersecTags(tags1, tags2) {
    const inter = [];
    for (const t of tags1) {
      if (tags2.indexOf(t) !== -1) {
        inter.push(t);
      }
    }
    return inter;
  }
  
  function diffTags(base, minus) {
    return base.filter(t => minus.indexOf(t) === -1);
  }
  
  function uniqTags(tags1, tags2) {
    return [...tags1, diffTags(tags2, intersecTags(tags1, tags2))];
  }
  
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  
  function extractSome(list, max) {
    const extracted = [];
    while (list.length > 0 && extracted.length < max) {
      const index = getRandomInt(list.length);
      const slice = list.splice(index, 1);
      if (typeof slice !== "undefined" && slice.length > 0) {
        extracted.push(slice[0]);
      }
    }
    return extracted;
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
    const photosSort = new Set(photos.map(p => p.tags).join(",").split(","));
    return {
        tags : Array.from(photosSort),
        photos
    };
}

function sortSlides(slide1, slide2) {
    // .sort((t1, t2) => t1
    const setAll = new Set(slide1.tags.concat(slide2.tags));
    const diff = (slide1.tags.length + slide2.tags.length) - setAll.size;
    if (diff === 0) {
        return 1000;
    } else {
        return 100 / diff;
    }
}

module.exports = processInput;