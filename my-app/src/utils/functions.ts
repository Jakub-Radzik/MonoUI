export const maxDomain = (maxValue: number) => {
    const zeros = parseInt(maxValue.toString()).toString().length - 1;
    const offset = Number('1' + '0'.repeat(zeros)) / 2;
    return maxValue + offset ;
}