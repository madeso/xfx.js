const tracery = require('tracery-grammar')

const grammar = tracery.createGrammar
({
    'emotion': ['sad','happy','angry','jealous', 'brave', 'crazy'],
    'job': ['bard', 'warrior', 'bard', 'wizard', 'druid', 'thief'],

    // names from tracery tutorial...
    // todo(Gustav): figure out some xf names
    "name": ["Arjun","Yuuma","Darcy","Mia","Chiaki","Izzi","Azra","Lina"],
    'hero_name': ['#name# the #emotion# #job#'],

    'sfx_weapon': ['swish', 'swosh', 'wish', 'wash', 'kablam', 'kapow'],

    'text_attack': ['#sfx_weapon.capitalize#! You swung your sword.', 'You swung your sword. #sfx_weapon.capitalize#!'],
    'text_gave': ['Gave #thing# to #hero_name#']
});
grammar.addModifiers(tracery.baseEngModifiers);

const simple = rule => () => grammar.flatten(`#${rule}#`);

// gave <thing> to fellow traveler
// hero name

module.exports.attack = simple('text_attack')
// todo(Gustav): hrm... is this the proper way to send variable sto tracery?
module.exports.gave = (thing) => grammar.flatten(`#[thing:${thing}]text_gave#`);
