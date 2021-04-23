import React from 'react';
import { couldStartTrivia } from 'typescript';
import './app.css';

import * as game from './game'

const Log = (props: {log: game.Log}) =>
{
    return (
        <div className="line">
            {props.log.message}
        </div>
    );
}

const Chapter = (props: {chapter: game.Chapter}) =>
{
    return (
        <div className="chapter">
            {
                props.chapter.messages.map((log, i) =>
                {
                    // Return the element. Also pass key
                    return (<Log log={log}/>)
                })
            }
        </div>
    );
}

type Ref = React.RefObject<HTMLInputElement>;


const Bar = (props: {range: game.Ranged, type: string}) =>
{
    const size = 200;
    const scale = props.range.current / props.range.max;
    const bar_value_size = size * Math.max(0, scale);
    const text_position = 3 + bar_value_size;
    return (
        <>
            <div className="bar" style={
                {
                    width: size
                }
            }>
                <div className={`bar_value bar_type_${props.type}`} style={
                    {
                        width: bar_value_size
                    }
                }/>
                <div className="bar_text" style={
                    {
                        left: text_position
                    }
                }>{props.range.current}</div>
            </div>
        </>
        );
}

const MonsterFight = (props: { monster: game.Monster, player: game.Player, remainingMonsters: number, history: game.Chapter[],onAttack:()=>void, button_group: Ref}) => {
    const size = 200;
    return (
        <>
            <div className="log">
                {
                    props.history.map((chapter, i) =>
                    {
                        return (<Chapter chapter={chapter}/>)
                    })
                }
            </div>
            <div id="monster_prop">
                <div className="property">
                    <div className="key">Monster</div>
                    <div className="value">
                        {props.monster.name}
                    </div>
                </div>

                <div className="property">
                    <div className="key">HP</div>
                    <div className="value">
                        <Bar range={props.monster.hp} type="hp"/>
                    </div>
                </div>

                <div className="property">
                    <div className="key">Remaining monsters</div>
                    <div className="value">
                        {props.remainingMonsters.toString()}
                    </div>
                </div>
            </div>
            <div className="actions" ref={props.button_group}>
                <button>Shout</button>
                <button onClick={props.onAttack}>Attack</button>
                <button>Magic</button>
            </div>
            <div id="player_prop">
                <div className="property">
                    <div className="key">Health</div>
                    <div className="value">
                        <Bar range={props.player.health} type="hp"/>
                    </div>
                </div>

                <div className="property">
                    <div className="key">XP</div>
                    <div className="value">
                        <Bar range={props.player.xp} type="xp"/>
                    </div>
                </div>

                <div className="property">
                    <div className="key">Weapon</div>
                    <div className="value">
                        {props.player.weapon.name}
                    </div>
                </div>

                <div className="property">
                    <div className="key">Level</div>
                    <div className="value">
                        {props.player.level}
                    </div>
                </div>
            </div>
        </>
    );
};

const ItemToBuy = (props: {name: string, cost: number, can_buy: () => boolean, buy: () => void}) =>
{
    const [is_hover, set_hover] = React.useState(false);

    const can_buy_css = props.can_buy() ? 'affordable' : ''

    return <button className={`item ${can_buy_css}`}
        onMouseEnter={() => set_hover(true)}
        onMouseLeave={()=>set_hover(false)}
        onClick={props.buy}
    >
        <div className="name">{props.name}</div>
        {
            is_hover &&
            <div className="gold">{props.cost}</div>
        }
    </button>;
}

const Store = (props: {name: string, player: game.Player, buy_item: (index: number) => void, can_buy: (index: number) => boolean, items: game.Buyable[]}) =>
{
    const [is_store_visible, set_store_visible] = React.useState(false);
    const [greeting, set_greeting] = React.useState("");
    const open_store = () =>
    {
        set_store_visible(true);
        set_greeting(game.get_store_greeting());
    };

    return (<>
        <button onClick={() => open_store()}>Go to {props.name}</button>
        {
            is_store_visible &&
            <>
                <div className="whiteout"/>
                <div className="popup_base">
                    <div className="popup">
                        <div className="store_title">{props.name}</div>
                        <div className="store_greeting">{greeting}</div>
                        <div className="store_items">
                            {
                                props.items.map((item, i) =>
                                {
                                    return <ItemToBuy name={item.name} cost={item.gold} can_buy={() => props.can_buy(i)} buy={() => props.buy_item(i)}/>
                                })
                            }
                        </div>
                        <div className="inventory">
                            <div className="current_gold">
                                {props.player.gold}
                            </div>
                        </div>
                        <button onClick={() => set_store_visible(false)}>Go back to city square</button>
                    </div>
                </div>
            </>
        }
    </>);
}

const City = (props: {history: game.Chapter[], button_group: Ref, goto_next_city: ()=>void, player: game.Player, buy_weapon: (n: number)=> void}) =>
{
    return <>
        <div className="log">
            {
                props.history.map((chapter, i) =>
                {
                    return (<Chapter chapter={chapter}/>)
                })
            }
        </div>
        <div className="actions" ref={props.button_group}>
            <Store
                name="Armory"
                player={props.player}
                items={game.weapons}
                can_buy={(n: number) => game.can_buy_weapon(props.player, n)}
                buy_item={props.buy_weapon}
            />
            <button onClick={props.goto_next_city}>Travel to next city</button>
        </div>
    </>;
}

const Game = (props: {state: game.State, setState: (state: game.State) => void}) => {
    const button_group = React.useRef<HTMLInputElement>(null);
    const focus = () =>
    {
        if(button_group.current)
        {
            button_group.current.scrollIntoView();
        }
    };

    if(props.state.monster != null)
    {
        // fight monsters
        return <MonsterFight
            monster={props.state.monster}
            player={props.state.player}
            remainingMonsters={props.state.monsters_remaining}
            history={props.state.history}
            onAttack={() => {
                var state = props.state;
                game.player_attack(state);
                props.setState({...state});
                focus();
            }}
            button_group={button_group}
            />;
    }
    else
    {
        return <City
            history={props.state.history}
            goto_next_city={()=>{
                var state = props.state;
                game.enter_new_city(state);
                props.setState({...state});
                focus();
            }}
            button_group={button_group}
            player={props.state.player}
            buy_weapon={
                (weapon_index: number) => {
                    var state = props.state;
                    game.buy_weapon(state, weapon_index);
                    props.setState({...state});
                    focus();
                }
            }
        />;
    }
}

function App()
{
    const [state, setState] = React.useState(game.new_game());
    const newGame = () =>
    {
        setState(game.new_game());
    };
    return (
        <div className="app">
            <div id="meny">
                <div id="title">XFx</div>
                <div id="buttons">
                    <button onClick={newGame}>New game</button>
                </div>
            </div>
            <div id="body">
                <Game state={state} setState={setState}/>
            </div>
        </div>
    );
}

export default App;
