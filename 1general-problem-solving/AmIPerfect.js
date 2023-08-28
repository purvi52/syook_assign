function classifyNumber(n) {
    let sum = 1; // 1 is always a factor

    for (let i = 2; i * i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            sum += i;
            if (i !== n / i) { 
                sum += n / i;
            }
        }
    }

    if (sum === n) {
        return "Perfect";
    } else if (sum > n) {
        return "Abundant";
    } else {
        return "Deficient";
    }
}

const num = parseInt(prompt("Enter a number:"), 10);
console.log(`The number ${num} is ${classifyNumber(num)}.`);

