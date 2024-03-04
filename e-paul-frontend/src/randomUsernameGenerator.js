
export function generateRandomUsername() {
    // Adjectives with 4-6 letters
    const adjectives = ["Happy", "Silly", "Funny", "Crazy", "Lucky", "Sunny", "Witty", "Zippy", "Bumpy", "Dizzy"];
    // Nouns with 4-6 letters
    const nouns = ["Apple", "Banana", "Cherry", "Donkey", "Eagle", "Fairy", "Giraf", "Horse", "Igloo", "Joker"];

    // Randomly select an adjective and a noun
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    // Concatenate the adjective and the noun
    return adjective + noun;
}