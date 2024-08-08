export const randomNumberShared = (numDigits: number) => {
    // Validate input
    if (typeof numDigits !== 'number' || numDigits <= 0 || !Number.isInteger(numDigits)) {
        throw new Error('Invalid input: Please provide a positive integer for the number of digits.');
    }

    // Generate a random floating-point number between 0 (inclusive) and 1 (exclusive)
    let randomFloat: number = Math.random();

    // Scale the number to have the desired number of digits
    let scaledRandom: number = randomFloat * Math.pow(10, numDigits - 1);

    // Convert the scaled number to an integer
    return Math.floor(scaledRandom);
};