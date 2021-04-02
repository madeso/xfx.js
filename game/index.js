module.exports.new_game = () =>
({
});

module.exports.armors =
[
    {'name': 'bear pelt', 'ap': 2, 'gold': 50},
    {'name': 'wooden armor', 'ap': 5, 'gold': 125},
    {'name': 'ring mail', 'ap': 10, 'gold': 250},
    {'name': 'roman armor', 'ap': 15, 'gold': 375},
    {'name': 'knight armor', 'ap': 20, 'gold': 500},
    {'name': 'dragon hide', 'ap': 30, 'gold': 800},
    {'name': 'magic armor', 'ap': 45, 'gold': 2500},
];

module.exports.weapons =
[
    {'name': 'dagger', 'dmg': 1, 'gold': 25},
    {'name': 'knife', 'dmg': 2, 'gold': 50},
    {'name': 'roman sword', 'dmg': 8, 'gold': 200},
    {'name': 'viking broad sword', 'dmg': 15, 'gold': 375},
    {'name': 'axe', 'dmg': 20, 'gold': 500},
    {'name': 'battle axe', 'dmg': 50, 'gold': 1250},
    {'name': 'excalibur', 'dmg': 150, 'gold': 3750},
];


const generate_enemy_goblin = () =>
({
    name: "goblin",
    hit: 2,
    armor: 1,
    damage: 2,
    magic_damage: 1,
    gold: 5,
    xp: 5,
});
const generate_enemy_orc = () =>
({
    name: 'orc',
    hit: 10,
    armor: 0,
    damage: 4,
    magic_damage: 1,
    gold: 20,
    xp: 13
});
const generate_enemy_black_knight = () =>
({
    name: 'black_knight',
    hit: 20,
    armor: 15,
    damage: 10,
    magic_damage: 1,
    gold: 30,
    xp: 38
});
const generate_enemy_insect_soldier = () =>
({
    name: 'insect_soldier',
    hit: 10,
    armor: 2,
    damage: 8,
    magic_damage: 1,
    gold: 20,
    xp: 17
});
const generate_enemy_nightmare_creature = () =>
({
    name: 'nightmare_creature',
    hit: 2,
    armor: 20,
    damage: 1,
    magic_damage: 16,
    gold: 50,
    xp: 28
});
const generate_enemy_stone_man = () =>
({
    name: 'stone_man',
    hit: 100,
    armor: 25,
    damage: 30,
    magic_damage: 1,
    gold: 10,
    xp: 96
});
const generate_enemy_dwarf = () =>
({
    name: 'dwarf',
    hit: 10,
    armor: 2,
    damage: 25,
    magic_damage: 1,
    gold: 50,
    xp: 37
});
const generate_enemy_zombie = () =>
({
    name: 'zombie',
    hit: 10,
    armor: 0 ,
    damage:6,
    magic_damage: 0,
    gold: 10,
    xp: 13
});
const generate_enemy_viking = () =>
({
    name: 'viking',
    hit: 12,
    armor: 4,
    damage: 15,
    magic_damage: 8,
    gold: 45,
    xp: 22
});
const generate_enemy_evil_sorcerer = () =>
({
    name: 'evil_sorcerer',
    hit: 50,
    armor: 5,
    damage: 1,
    magic_damage: 70,
    gold: 150,
    xp: 78
});

const one_of = items =>
{
    return items[Math.floor(Math.random() * items.length)];
}

const list_enemies = level =>
{
    let enemies = [generate_enemy_goblin];

    // todo(Gustav): balance enemies
    // weighted map instead of totally random
    
    if(level >= 2 ) { enemies.push(generate_enemy_black_knight); }
    if(level >= 2 ) { enemies.push(generate_enemy_viking); }
    if(level >= 3 ) { enemies.push(generate_enemy_dwarf); }
    if(level >= 4 ) { enemies.push(generate_enemy_orc); }
    if(level >= 5 ) { enemies.push(generate_enemy_zombie); }
    if(level >= 6 ) { enemies.push(generate_enemy_insect_soldier); }
    if(level >= 7 ) { enemies.push(generate_enemy_nightmare_creature); }
    if(level >= 8 ) { enemies.push(generate_enemy_stone_man); }
    if(level >= 9 ) { enemies.push(generate_enemy_evil_sorcerer); }
    
    return enemies;
}

module.exports.generate_enemy = level => one_of(list_enemies(level))()

/*
log status: (keep 5 latest logs?)
player status:
    health (current, max)
    mana (current, max)
    level
    xp (current, max)
    weapon:
        name
        damage
        tracery rule
    armor:
        points
        name
    gold
    items (list):
        name
        action (hp, mana)
    
        spells?
            name
            action (health, damage)
            strength

combat:
    remaining monsters (int)
    monster data:
        health
        gold drops
        damage
        name
        attack chance
        traccery rule for attack
        tracery rule for defend
  
city:
    shot lists
        armor, weapon, items
    
    train?
        increase xp for gold

    travel to (list of city names)
        name

shop:
    health potion:
        10 hp, 20 gold
        50 hp, 60 gold
        100 hp, 150 gold
    magic potion:
        10 mp, 40 gold
        50 mp, 120 gold
        100 mp, 300 gold
    items:
        amulette:
            +1 mp damage, 500 gold
*/