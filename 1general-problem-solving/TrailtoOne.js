function trailtoOne(x) {
    let steps = 0;
    while (x !== 1) {
        if (x % 2 === 0) {
            x /= 2;
        } else {
            x = 3 * x + 1;
        }
        steps++;
    }
    return steps;
}

const num = parseInt(prompt("Enter a positive integer:"), 10);

if (num <= 0) {
    console.log("Please enter a positive integer.");
} else {
    console.log(`The number of steps required to reach 1 is: ${trailtoOne(num)}`);
}
