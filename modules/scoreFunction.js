"use strict";

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

/**
 *
 * According to an Input javascript object and an Output javascript object,
 * it calculate the score of the output object
 *
 * @param {Object} input
 * @param {Object} output
 * @returns {number}
 */
function computeScore(input, output) {
  let score = 0;
  const slides = output.slides;
  const nbIntersec = slides.length - 1;

  for (let i = 0; i < nbIntersec; i++) {
    const prevSlideTags = extractTags(slides[i]);
    const nextSlideTags = extractTags(slides[i+1]);
    const commonTags = intersecTags(prevSlideTags, nextSlideTags);
    const uniqTagsPrevSlide = diffTags(prevSlideTags, commonTags);
    const uniqTagsNextSlide = diffTags(nextSlideTags, commonTags);
    const minTagNb = Math.min(commonTags.length, uniqTagsPrevSlide.length, uniqTagsNextSlide.length);
    score += minTagsNb;
  }

  return score;
}

module.exports = computeScore;
