import '../public/stylesheets/global.css';

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Aquarium from './component.Aquarium';

import anime from 'animejs';
import * as PIXI from 'pixi.js';
import { SPRITES } from './utils.SPRITES';

function App() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resources, setResources] = useState();

    useEffect(() => {
        const loader = new PIXI.Loader();
        loader.counter = 0;
        for (const key in SPRITES) {
            loader.add(key, SPRITES[key]);
        }
        loader.use((resource, next) => {
            console.log(`Loading ${resource.url}`);
            setProgress(Math.round(++loader.counter / Object.keys(SPRITES).length * 100));
            next();
        });
        loader.load((loader, resources) => {
            setResources(resources);
            setIsLoaded(true);
        });
    }, []);

    return isLoaded ? <Aquarium resources={resources}/> : <Loader text={'Loading...'} progress={progress}/>;
}

function Loader(props) {
    const orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    const letters = [];
    for (const letter of props.text) {
        letters.push(letter);
    }

    useEffect(() => {
        document.querySelectorAll('.loader .letter').forEach((el, i) => {
            setTimeout(() => {
                anime({
                    targets: el,
                    translateY: -5,
                    duration: 6e2,
                    direction: 'alternate',
                    easing: 'easeInOutSine',
                    loop: true
                });
            }, 150 * i);
        });
    }, []);

    return (
        <div className='background' style={{ backgroundImage: `url('assets/bg1-${orientation}.jpg')` }}>
            <div className='loader'>
                <div>
                    {letters.map((l, i) => <span key={i} className='letter'>{l}</span>)}
                    <span>{`${props.progress}%`}</span>
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(<App/>, document.getElementById('app'));
