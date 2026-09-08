

const segmenter = new Intl.Segmenter(
    undefined,
    { granularity: "grapheme" }
);


function toCharacters(text) {
    return Array.from(
        segmenter.segment(text),
        item => item.segment
    );
}

//Exports
module.exports = {
    toCharacters
}