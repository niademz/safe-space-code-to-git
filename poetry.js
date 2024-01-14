// Define an array of poems
// Define an array of poems where each poem is an array of lines
const poems = [
  [
    "Social media🤳",
"In the hand-held cosmos of my screen, I flirt with life, a fickle courtesan,",
"Dancing through the digitized dreams of vicarious existence.",
"Giggles gush, like champagne bubbles, as I plunge into vignettes of other's joys,",
"Yet a specter of melancholy mocks my mirth, a paradox of pleasure.",
"Like a voracious vagabond, I leap from tale to tale,",
"Each story, a prism of possibilities my own existence hasn’t tasted.",
"Shimmering snapshots of passion and promise, they swirl and scatter,",
"Blooming from my phone, a kaleidoscope of covetous curiosity.",
"The phantasmal posts, they hold me, an ethereal enchantress entranced,",
"Each scroll, a siren's call, beckoning me into the abyss of jealousy.",
"In the mirror of this digital dominion, I see a stranger staring back,",
"Her heart hollowed by the humdrum of her un-lived life.",
"The screen, once a jester, now a jailer, chains me to its charm,",
"A cruel puppeteer, pulling the strings of my sanity, my self.",
"Caught in the gossamer net of envy, I gasp, gasping for the essence of experience,",
"Yearning for the yesterdays I had, yet never lived.",
"In this social sea, I am but a solitary sailor, adrift and drowning,",
"My soul, a silent scream echoing in the void of virtual vanity.",
"Oh, the irony! In seeking connection, I am but a ghost,",
"Lost in the labyrinth of lives lived, while mine awaits to be lived.",
"- Ndemz"
    // Add more lines as needed
  ],
  [
    "Over",
    "Like a bird sitting on the floor...",
    "I refused to take flight",
    "Not because I couldn't",
    "But because I did not want to.",
    "-Abby Stace"
    // Add more lines as needed
  ],
  [
    "Two shaky hearts in love",
    "Naked wires, we are",
    "Always causing sparks to fly, but never good for anyone",
    "We are volatile",
    "And we dance around the world",
    "Without ever holding hands.",
    "We look at each other, not our alike hearts,",
    "For they dress themselves in fallacies",
    "And hold unto those million sparks.",
    "I give my last name to another,",
    "And you take that which is not mine,",
    "So our hearts continue in this fever,",
    "And quarantined dance",
    "-Aduks"
  ],
  [
    "Purgatorial Hours - A Plant's Perspective",
    "Awakened by the caress of the gentle stream",
    "I survey the musty ambiance engulfing me",
    "Ubiquitous instructions scream 'FOLLOW ME IF YOU WANT TO ESCAPE' - so I do",
    "I toil for 24 hours before the warmth starts to seep in",
    "It spreads like viscous honey enveloping me and flooding the place with light",
    "Suddenly the instructions scream louder becoming more eloquent by the second",
    "It takes 168 hours before I reach the source of this warmth",
    "'Come, my child' it encourages, patting me on my back as I clamber through the suffocating",
    "Walls leaving glory in my wake",
    "",
    "Some days the gentle stream transforms into a peltering thunderstorm",
    "And some days the warmth intensifies with ethereal fervour",
    "Some days the gods that walk trample on me instigating my downward spiral",
    "And some days my domineering mind asserts its dominance",
    "",
  "I endure purgatorial hours to coax the greatness brewing within",
  "Barely lurking beneath the surface searching for a place to seep through - I finally discovered my purpose",
  "To shelter the furries and to protect the gods come rain and shine",
  "To flaunt the lights during christmas and to purify the air for all the life forms",
  "Some seasons and lose my glory and my greatness faulters momentarily",
  "But now I have learnt the greatest lesson of all-",
  "My greatness will always return",
  "-Frances"
  ],
  [
    "The nature of Mother",
    "Coarseness ran through her veins",
    "Like thorns wrapped around her attitude like a vine",
    "The blooming harshness of expectations and hard hitting words",
    "The one who grew from hatered at birth",
    "That was a mother nature",
    "No, that was mother's nature",
    "- Madame Patel"
  ],
  // Add more poems as needed
];

// Get references to the elements
const poemContainer = document.querySelector(".poem-container");
const nextPoemButton = document.getElementById("nextPoem");

let currentPoemIndex = 0; // Track the current poem index

// Function to display the current poem
function displayCurrentPoem() {
  const poemLines = poems[currentPoemIndex];
  const poemHTML = poemLines.map(line => `<p class="poem">${line}</p>`).join("<br>");
  poemContainer.innerHTML = poemHTML;
}

// Initial display of the first poem
displayCurrentPoem();

// Event listener for the "Next Poem" button
nextPoemButton.addEventListener("click", () => {
  // Increment the current poem index
  currentPoemIndex++;

  // Check if we've reached the end of the poems
  if (currentPoemIndex >= poems.length) {
    currentPoemIndex = 0; // Start from the first poem again
  }

  // Display the updated poem
  displayCurrentPoem();
});