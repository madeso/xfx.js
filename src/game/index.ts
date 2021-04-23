
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


export interface Buyable
{
    name: string;
    gold: number;
}

export class Armor
{
    readonly name: string;
    readonly ap: number;
    readonly gold: number;

    constructor(name: string, ap: number, gold: number)
    {
        this.name = name;
        this.ap = ap;
        this.gold = gold;
    }
}

export class Weapon
{
    readonly name: string;
    readonly dmg: number;
    readonly gold: number;

    constructor(name: string, dmg: number, gold: number)
    {
        this.name = name;
        this.dmg = dmg;
        this.gold = gold;
    }
}

export class Monster
{
    readonly name: string;
    readonly hp: Ranged;
    readonly armor: number;
    readonly damage: number;
    readonly magic_damage: number;
    readonly gold: number;
    readonly xp: number;

    constructor(name: string, hit: number, armor: number, damage: number, magic_damage: number, gold: number, xp: number)
    {
        this.name = name;
        this.hp = new Ranged(hit);
        this.armor = armor;
        this.damage = damage;
        this.magic_damage = magic_damage;
        this.gold = gold;
        this.xp = xp;
    }
}

export const armors: Armor[] =
[
    {'name': 'bear pelt', 'ap': 2, 'gold': 50},
    {'name': 'wooden armor', 'ap': 5, 'gold': 125},
    {'name': 'ring mail', 'ap': 10, 'gold': 250},
    {'name': 'roman armor', 'ap': 15, 'gold': 375},
    {'name': 'knight armor', 'ap': 20, 'gold': 500},
    {'name': 'dragon hide', 'ap': 30, 'gold': 800},
    {'name': 'magic armor', 'ap': 45, 'gold': 2500},
];

export const weapons: Weapon[] =
[
    {'name': 'dagger', 'dmg': 1, 'gold': 25},
    {'name': 'knife', 'dmg': 2, 'gold': 50},
    {'name': 'roman sword', 'dmg': 8, 'gold': 200},
    {'name': 'viking broad sword', 'dmg': 15, 'gold': 375},
    {'name': 'axe', 'dmg': 20, 'gold': 500},
    {'name': 'battle axe', 'dmg': 50, 'gold': 1250},
    {'name': 'excalibur', 'dmg': 150, 'gold': 3750},
];

const generate_enemy_goblin = () => new Monster("goblin", 2, 1, 2, 1, 5, 5);
const generate_enemy_orc = () => new Monster('orc', 10, 0, 4, 1, 20, 13);
const generate_enemy_black_knight = () => new Monster('black_knight', 20, 15, 10, 1, 30, 38);
const generate_enemy_insect_soldier = () => new Monster('insect_soldier', 10, 2, 8, 1, 20, 17);
const generate_enemy_nightmare_creature = () => new Monster('nightmare_creature', 2, 20, 1, 16, 50, 28);
const generate_enemy_stone_man = () => new Monster('stone_man', 100, 25, 30, 1, 10, 96);
const generate_enemy_dwarf = () => new Monster('dwarf', 10, 2, 25, 1, 50, 37);
const generate_enemy_zombie = () => new Monster('zombie', 10, 0, 6, 0, 10, 13);
const generate_enemy_viking = () => new Monster('viking', 12, 4, 15, 8, 45, 22);
const generate_enemy_evil_sorcerer = () => new Monster('evil_sorcerer', 50, 5, 1, 70, 150, 78);

export class Ranged
{
    current: number;
    max: number;

    constructor(current: number)
    {
        this.current = current;
        this.max = current;
    }
}

function one_of<T>(items: T[]): T
{
    return items[Math.floor(Math.random() * items.length)];
}

const list_enemies = (level: number) =>
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

const generate_enemy = (level: number) => one_of(list_enemies(level))();

export class Log
{
    message: string;

    constructor(message: string)
    {
        this.message = message;
    }
}

export class Chapter
{
    messages: Log[];

    constructor()
    {
        this.messages = [];
    }
}


export class City
{
    name: string;

    constructor(name: string)
    {
        this.name = name;
    }
}

export class Player
{
    health = new Ranged(10)
    level = 10;
    xp = new Ranged(100);
    weapon = new Weapon('fists', 0, 0);
    gold = 100;
}

const random = (max: number, min: number=1) =>
{
    return min+Math.floor(Math.random()*(max - min));
}

export class State
{
    player = new Player();

    city: City;
    monster: null| Monster= null;
    monsters_remaining = 0;
    history: Chapter[];

    constructor(city: City)
    {
        this.city = city;
        this.history = [];
    }
}

const add_new_chapter = (state: State) =>
{
    state.history.push(new Chapter());
}

const log = (state: State, text: string) =>
{
    if(state.history.length === 0)
    {
        add_new_chapter(state);
    }
    state.history[state.history.length-1].messages.push(new Log(text));
}

export const enter_new_city = (state: State) =>
{
    if(state.monster != null)
    {
        return;
    }

    add_new_chapter(state);
    log(state, "After a long journey you reach the city.")

    state.monster = generate_enemy(state.player.level);
    state.monsters_remaining = random(10)
    log(state, state.monster.name + " appears");
};

export const set_new_monster = (state: State) =>
{
    add_new_chapter(state);

    if(state.monsters_remaining > 0)
    {
        state.monster = generate_enemy(state.player.level);
        state.monsters_remaining -= 1;
        log(state, state.monster.name + " appears");
    }
    else
    {
        state.monster = null;
        log(state, "You enter the gate");
    }
};



const check_for_level_up = (state: State) =>
{
    const player = state.player;
    if(player.xp.current >= player.xp.max)
    {
        player.xp.current -= player.xp.max;
        player.xp.max *= 2;
        player.level += 1;
        log(state, `You have reached level ${player.level}`);
    }
}


const player_hit = (state: State) =>
{
    if(state.monster == null)
    {
        console.log("no monster")
        return;
    }

    const damage = random(state.player.level) + state.player.weapon.dmg;
    state.monster.hp.current -= damage;
    if(state.monster.hp.current <= 0)
    {
        log(state, `You killed ${state.monster.name} dealing ${damage} damage.`);
        const gold = random(state.monster.gold, 0);
        if(gold > 0)
        {
            log(state, `You picked up ${gold} gold from the corpse.`);
            state.player.gold += gold;
        }
        const xp = state.monster.xp; // make random?
        state.player.xp.current += xp;
        log(state, `You got ${xp} xp`);
        check_for_level_up(state);
        set_new_monster(state);
    }
    else
    {
        log(state, `You hit ${state.monster.name} dealing ${damage} damage.`);
    }
}

const monster_hit = (state: State) =>
{
    if(state.monster == null)
    {
        return;
    }

    const damage = random(state.monster.damage);
    state.player.health.current -= damage;
    if(state.player.health.current <= 0)
    {
        log(state, `You were killed by ${state.monster.name} dealing ${damage} damage!`);
    }
    else
    {
        log(state, `${state.monster.name} hit you dealing ${damage} damage.`);
    }
}

export const player_attack = (state: State) =>
{
    const c = random(1, 0);
    console.log(c);
    if(c == 0)
    {
        monster_hit(state);
        player_hit(state);
    }
    else
    {
        player_hit(state);
        monster_hit(state);
    }
};

export const new_game = () =>
{
    const state = new State( new City('city') );

    enter_new_city(state);

    return state;
};

export const get_store_greeting = () =>
{
    return "Greetings stranger, what do you need?";
}

export const can_buy_weapon = (player: Player, weapon_index: number) =>
{
    return player.gold <= weapons[weapon_index].gold;
}

export const buy_weapon = (state: State, weapon_index: number) =>
{
    log(state, `You gave away your ${state.player.weapon.name}`);
    state.player.weapon = weapons[weapon_index];
    log(state, `This ${state.player.weapon.name} will serve me well`);
    state.player.gold -= state.player.weapon.gold;
}
