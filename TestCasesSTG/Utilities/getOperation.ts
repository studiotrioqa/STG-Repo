const price = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // will be used to increase/decrease the price of the item by randomly selecting an index from the array
const operation = ['+', '-']; // will be used to randomly select an operation to perform on the price of the item
export const getOperation = operation[Math.floor(Math.random() * operation.length)];
export const addPrice = price[Math.floor(Math.random() * price.length)]; // will be used to increase the price of the item by a random amount