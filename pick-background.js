var probable = require('probable');

var backgroundImages = [
  'abandoned-828591_1280.jpg',
  'building-710886_1280.jpg',
  'buildings-690696_1280.jpg',
  'castle-788416_1280.jpg',
  'crash-549661_1280.jpg',
  'home-431331_1920.jpg',
  'home-557297_1920.jpg',
  'house-242712_1280.jpg',
  'house-691379_1280.jpg',
  'house-crash-267173_1280.jpg',
  'hut-209466_1280.jpg',
  'krot-375242_1280.jpg',
  'roof-540835_1280.jpg',
  'ruin-368201_1920.jpg',
  'ruin-511842_1280.jpg',
  'ruin-655817_1280.jpg',
  'scary-house-677368_1280.jpg',
  'shack-140674_1280.jpg',
  'tornado-375135_1920.jpg',
  'village-896738_1280.jpg'
];

function pickBackground() {
  return 'images/' + probable.pickFromArray(backgroundImages);
}

module.exports = pickBackground;
