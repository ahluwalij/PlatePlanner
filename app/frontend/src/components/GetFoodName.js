// the foods listed earlier have higher priority
const foodNames = ['Waffle', 'Pancake', 'Burrito', 'Sub', 'Sandwich', 'Turkey', 'Pizza', 'Salmon', 'Rice', 'Salad',
    'Chicken', 'Sausage', 'Steak', 'Soda', 'Fish', 'Pitcher', 'Can', 'Egg', 'Bread', 'Toast', 'Jelly',
    'Drink', 'Smoothie', 'Coffee', 'Tea', 'Peanut', 'Breakfast', 'Milk', 'Lemonade', 'Green', 'Honey',
    'Cucumber', 'Carrot', 'Corn', 'Eggplant', 'Apple', 'Pear', 'Pineapple', 'Banana', 'Chinese', 'Chips',
    'Clams', 'Octopus', 'Shrimp', 'Lobster', 'Sushi', 'Donut', 'Cake', 'Cupcake', 'Pastry', 'Pie', 'Pretzel', 'Cookie', 'Dessert',
    'Tomato', 'Onion', 'Pepper', 'Garlic', 'Kiwi', 'Radish', 'Lemon', 'Orange', 'Spicy', 'Potato', 'Olive', 'Strawberry', 'Plum',
    'Peach', 'Grapefruit', 'Pea', 'Cabbage', 'Brocolli', 'Pumpkin', 'Grape', 'Cherry', 'Watermelon', 'Cream', 'Bacon', 'Ribs', 'Candy', 'Chocolate', 'Popsicle', 'Burger', 'Taco',
    'Dog', 'Fries', 'Cheese', 'Other'];

export function getName(query) {
    let resFood = null;
    let found = false;
    foodNames.forEach(word => {
        if (!found) {
            // case sensitive bc all the meals in the databse start with a capital letter
            // and so you don't match "egg" with "Veggie Pancakes"
            if (query.includes(word)) {
                resFood = word;
                found = true;
            }
        }
    });
    if (resFood)
        return resFood + '.svg';
    else
        return 'Other.svg';
}