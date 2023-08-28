function fishesHit(num, k, l, m, n)
{
    let fishesNotHit = 0;
    for(i = num; i > 0; i--)
    {
        if(i%k != 0 && i%l != 0 && i%m != 0 && i%n != 0)
            fishesNotHit++;
        
    }
    return (num - fishesNotHit);
}

console.log(fishesHit(24,2,3,4,5));
console.log(fishesHit(12,1,2,3,4));
