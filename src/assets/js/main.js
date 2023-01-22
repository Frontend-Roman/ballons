let text = "I love cats. Cats are very easy to love. Cats are very popular.";
text = text.replaceAll("Cats", "Dogs");
text = text.replaceAll("cats", "dogs");


class Person {
    constructor(name) {
        this.name = name;
    }
}

const person1 = new Person('John');
console.log('My name ' + person1.name + '. ' + text);
//
// document.querySelector(".main > button").addEventListener('click'), function () {
//     alert('Hello');
// }

function hello() {
    alert('Hello world!')
}