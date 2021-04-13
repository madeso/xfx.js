import React from 'react';
import './App.css';

import { Container, Row, Button, Col, Navbar, Nav, ButtonGroup, Form } from 'react-bootstrap';

import * as game from './game'

const MonsterFight = (props: { monster: game.Monster, player: game.Player, remainingMonsters: number, onAttack:()=>void}) => {
    return (
        <>

            <Form>
                <Form.Group as={Row}>
                    <Form.Label column sm="2">
                        Monster
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" placeholder={props.monster.name} readOnly />
                    </Col>

                    <Form.Label column sm="2">
                        HP
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" placeholder={props.monster.hp.current.toString()} readOnly />
                    </Col>
                    <Form.Label column sm="2">
                        Remaining monsters
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" placeholder={props.remainingMonsters.toString()} readOnly />
                    </Col>
                </Form.Group>
            </Form>
            <ButtonGroup aria-label="Actions">
                <Button variant="secondary">Shout</Button>
                <Button variant="secondary" onClick={props.onAttack}>Attack</Button>
                <Button variant="secondary">Magic</Button>
            </ButtonGroup>
            <Form>
                <Form.Group as={Row}>
                    <Form.Label column sm="2">
                        Health
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" placeholder={props.player.health.current.toString()} readOnly />
                    </Col>

                    <Form.Label column sm="2">
                        Weapon
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" placeholder={props.player.weapon.name} readOnly />
                    </Col>
                </Form.Group>
            </Form>
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
        <>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#home">XFx</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="#home" onClick={newGame}>New game</Nav.Link>
                </Nav>
            </Navbar>
            <Container>
                <Row className="justify-content-md-center">
                    <Col xs lg="2" />
                        <Col md="auto">
                            <Game state={state} setState={setState}/>
                        </Col>
                    <Col xs lg="2" />
                </Row>
            </Container>
        </>
    );
}

export default App;
