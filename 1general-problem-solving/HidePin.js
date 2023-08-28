function decompose(target, nums) {
    const dp = Array(target + 1).fill(null);
    dp[0] = []; // base case

    for (let i = 1; i <= target; i++) {
        let shortestCombination = null;
        for (let num of nums) {
            if (i - num >= 0 && dp[i - num] !== null) {
                const combination = [...dp[i - num], num];
                if (!shortestCombination || combination.length < shortestCombination.length) {
                    shortestCombination = combination;
                }
            }
        }
        dp[i] = shortestCombination;
    }

    return dp[target];
}

function hidePin(decomposed)
{
    const conversionTable = {
        '1': 'pop',
        '10': 'double rip',
        '100': 'hide your mints',
        '1000': 'fall',
        '10000': ''
    }
    let ans = [];
    for(i = 0; i < decomposed.length; i++)
    {
        let valueToPush = conversionTable[decomposed[i].toString()]
        if(valueToPush !== '')
        {
            ans.push(valueToPush);
        }
        else
        {
            ans.reverse();
        }
    }
    return ans
}

const numberToDecompose = 11;
const availableNumbers = [10000, 1000, 100, 10, 1];
decomposedList = decompose(numberToDecompose, availableNumbers)
console.log(decomposedList);
console.log(hidePin(decomposedList))

