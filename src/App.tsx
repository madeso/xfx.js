import React from 'react';
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
                        <div className="bar" style={
                            {
                                width: size
                            }
                        }>
                            <div className="bar_value" style={
                                {
                                    width: size * (props.monster.hp.current / props.monster.hp.max)
                                }
                            }/>
                        </div>
                        {props.monster.hp.current.toString()}
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
                        {props.player.health.current.toString()}
                    </div>
                </div>

                <div className="property">
                    <div className="key">Weapon</div>
                    <div className="value">
                        {props.player.weapon.name}
                    </div>
                </div>
            </div>
        </>
    );
};

const City = (props: {history: game.Chapter[], button_group: Ref, goto_next_city: ()=>void}) =>
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
