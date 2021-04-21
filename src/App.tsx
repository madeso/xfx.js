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

const MonsterFight = (props: { monster: game.Monster, player: game.Player, remainingMonsters: number, history: game.Chapter[],onAttack:()=>void}) => {
    const button_group = React.useRef<HTMLInputElement>(null);
    const on_attack = () =>
    {
        props.onAttack();
        if(button_group.current)
        {
            button_group.current.scrollIntoView();
        }
    };

    return (
        <>
            <div className="log">
                {
                    props.history.map((chapter, i) =>
                    {     
                        console.log("Entered");                 
                        // Return the element. Also pass key     
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
            <div className="actions" ref={button_group}>
                <button>Shout</button>
                <button onClick={on_attack}>Attack</button>
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

const Game = (props: {state: game.State, setState: (state: game.State) => void}) => {
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
            }}/>;
    }
    else
    {
        // buy things in the city
        return <></>;
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
