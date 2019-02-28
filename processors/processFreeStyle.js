"use strict";
const _ = require("lodash"),
  R = require("ramda"),
  computeScore = require("../modules/scoreFunction.js"),
  tag = "processBasic";

function extractTags({ photos }) {
  let tags = {};
  for (const p of photos) {
    for (const t of p.tags) {
      tags[t] = t;
    }
  }
  return Object.keys(tags);
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
  return [...tags1, diffTags(tags2, ...intersecTags(tags1, tags2))];
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

function computeIntersec(slide1, slide2) {
  const common = intersecTags(slide1.tags, slide2.tags);
  const prev = diffTags(slide1.tags, common);
  const next = diffTags(slide2.tags, common);
  return [prev, common, next];
}

function computeBest(slides) {
  const slideshow = [];
  if (slides.length > 0) {
    let cur = slides.shift();
    slideshow.push(cur);
    while (slides.length > 0) {
      const someSlides = extractSome(slides, 5);
      const best = someSlides[0];
      const bestScore = Math.min(computeIntersec(cur, best));
      for (let i = 0; i < someSlides.length; i++) {
        const score = Math.min(computeIntersec(cur, someSlides[i]));
        if (score < bestScore) {
          best = someSlides[i];
          bestScore = score;
        }
      }
      const bestIndex = someSlides.indexOf(best);
      someSlides.splice(bestIndex, 1);
      someSlides.forEach(s => slides.push(s));
      cur = best;
      slideshow.push(cur);
    }
  }
  return slideshow;
}

/**
 *
 * @typedef ReturnProcess
 * @property {number} score
 * @property {Object} outputObject
 *
 * @param {Object} inputObject
 * @return {ReturnProcess}
 */
function processInput(inputObject) {
  const outputObject = {};
  const { horizontalPhotos, verticalPhotos } = inputObject;

  const verticalSlides = computeVerticales(verticalPhotos);
  const horizontalSlides = horizontalPhotos
    .map(p => [p])
    .map(createSlide)
    .map(s => Object.assign(s, { tags: s.photos[0].tags }));
    const allSlides = [...horizontalSlides, ...verticalSlides];
  outputObject.slides = computeBest(allSlides);
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

function permute(slides, index1, index2) {
  const temp = slides[index1];
  slides[index1] = slides[index2];
  slides[index2] = temp;
}

module.exports = processInput;
