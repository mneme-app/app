import indexes from "../whichIndexesIncorrect";

test("Returns empty array if both string arrays match (lowercase)", () => {
    const answers = ["One", "tWo", "tHRee", "foUr"];
    const correct = ["one", "two", "three", "four"];

    const test = indexes(answers, correct);
    expect(test.length).toEqual(0);
});

test("Returns empty array if answers match acceptable responses", () => {
    const answers = ["One", "tWo", "tHRee", "iv"];
    const correct = ["one", ["two", 2, "II"], "three", ["four", 4, "IV"]];

    const test = indexes(answers, correct);
    expect(test.length).toEqual(0);
});

test("Unordered - Returns empty array if both string arrays match (lowercase)", () => {
    const answers = ["tWo", "One", "foUr", "tHRee"];
    const correct = ["one", "two", "three", "four"];

    const test = indexes(answers, correct, false);
    expect(test.length).toEqual(0);
});

test("Unordered - Returns empty array if answers match acceptable responses", () => {
    const answers = ["tWo", "One", "iv", "tHRee"];
    const correct = ["one", ["two", 2, "II"], "three", ["four", 4, "IV"]];

    const test = indexes(answers, correct, false);
    expect(test.length).toEqual(0);
});

test("Returns last indexes of answers if answers has one extra item", () => {
    const answers = ["One", "tWo", "tHRee", "foUr", 5, "six", "VII", "ocho"];
    const correct = ["one", "two", "three", "four"];

    const test = indexes(answers, correct);
    expect(test[0]).toEqual(4);
});

test("Unordered - Returns last indexes of answers if answers has one extra item", () => {
    const answers = ["One", "tWo", "tHRee", "foUr", 5, "six", "VII", "ocho"];
    const correct = ["one", "two", "three", "four"];

    const test = indexes(answers, correct, false);
    expect(test[0]).toEqual(4);
});

test("Unordered - Repeated values are marked incorrect", () => {
    const answers = ["four", "four", "four", "foUr"];
    const correct = ["one", "two", "three", "four"];
    const test = indexes(answers, correct, false);

    const answers1 = ["a", "a", "two", "foUr"];
    const correct1 = ["one", "two", "three", "four"];
    const test1 = indexes(answers1, correct1, false);

    expect(test).toEqual([1, 2, 3]);
    expect(test1.includes(0)).toBe(true);
    expect(test1.includes(1)).toBe(true);
});
