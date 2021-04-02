const tracery = require('tracery-grammar')

const generate = grammar =>
{
    const compiled = tracery.createGrammar(grammar);
    compiled.addModifiers(tracery.baseEngModifiers);
    return () => compiled.flatten("#origin#");
};

module.exports.test = generate
({
    'animal': ['panda','fox','capybara','iguana'],
    'emotion': ['sad','happy','angry','jealous'],
    'origin':['I am #emotion.a# #animal#.'],
});
