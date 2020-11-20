import React, { Component, useState, useEffect, useRef } from 'react';
import InfoIcon from '../public/icons/info.svg';
import CloseIcon from '../public/icons/close.svg';
import { CSSTransition } from 'react-transition-group';

import * as PIXI from 'pixi.js';
import GiantFish from './class.GiantFish';
import FishSchool from './class.FishSchool';
import { SPRITES, PARAMS } from './utils.SPRITES';

class Aquarium extends Component {
    constructor(props) {
        super(props);
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: true
        });
        this.app.autoResize = true;
        this.app.renderer.view.style.transform = 'scale(1.02)';
        this.app.stage.filters = [];
        this.fishSchools = {};
    }

    componentDidMount() {
        document.getElementById('aquarium').appendChild(this.app.view);
        // background
        this.bg = new PIXI.Sprite(this.props.resources.bg1.texture);
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;
        this.app.stage.addChild(this.bg);
        // ripple
        this.bgFilter = new PIXI.Sprite(this.props.resources.bgFilter.texture);
        const ripple = new PIXI.filters.DisplacementFilter(this.bgFilter);
        this.bgFilter.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.app.stage.addChild(this.bgFilter);
        this.app.stage.filters.push(ripple);
        // depth map
        this.bgDepthMap = new PIXI.Sprite(this.props.resources.bg1DepthMap.texture);
        this.bgDepthMap.width = this.bg.width;
        this.bgDepthMap.height = this.bg.height;
        this.app.stage.addChild(this.bgDepthMap);
        this.depthMap = new PIXI.filters.DisplacementFilter(this.bgDepthMap);
        this.app.stage.filters.push(this.depthMap);

        // give me fish!
        this.fishSchools.fish6 = new FishSchool(this.props.resources.fish6.texture, 20, [1, 2], 50, 0);
        for (const school of Object.values(this.fishSchools)) {
            this.app.stage.addChild(school.getRenderableObject());
        }

        // window events
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('resize', this.handleWindowResize);

        // call the animate function
        this.animate();
    }

    componentWillUnmount() {
        this.app.destroy(true, true);
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('resize', this.handleWindowResize);
    }

    render() {
        return (
            <div id='aquarium'>
                <div className='info-container'>
                    <OptionList>
                        <Menu options={['Change Background', 'Give Me Fishes!']}>
                            <div className='scroll-container'>
                                {Object.keys(SPRITES).filter(key => key.match(/^bg\d+$/)).map(key => <li key={key} className='option'>
                                <img src={SPRITES[key]} alt={key} data-id={key} onClick={this.handleChangeBackground}/>
                                </li>)}
                            </div>
                            <div className='scroll-container'>
                                {Object.keys(SPRITES).filter(key => key.match(/^fish\d+$/)).map(key => <li key={key} className='option fish'>
                                <img src={SPRITES[key]} alt={key} data-id={key} onClick={this.handleAddFish}/>
                                </li>)}
                            </div>
                        </Menu>
                    </OptionList>
                </div>
            </div>
        );
    }

    animate = () => {
        this.bgFilter.x += 2;
        this.bgFilter.y += 1;
        for (const school of Object.values(this.fishSchools)) {
            if (Array.isArray(school)) {
                school.forEach(fish => fish.update());
            } else {
                school.update();
            }
        }
        requestAnimationFrame(this.animate);
    };

    handleMouseMove = e => {
        this.depthMap.scale.x = (window.innerWidth / 2 - e.clientX) / 10;
        this.depthMap.scale.y = (window.innerHeight / 2 - e.clientY) / 12;
    };

    handleWindowResize = () => {
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;
        this.bgDepthMap.width = this.bg.width;
        this.bgDepthMap.height = this.bg.height;
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
    };

    handleChangeBackground = e => {
        this.app.stage.removeChildren();
        this.bg.destroy();
        this.bgDepthMap.destroy();
        this.app.stage.filters.pop();
        const key = e.target.getAttribute('data-id');
        this.bg = new PIXI.Sprite(this.props.resources[key].texture);
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;
        this.app.stage.addChild(this.bg);
        this.app.stage.addChild(this.bgFilter);
        this.bgDepthMap = new PIXI.Sprite(this.props.resources[key + 'DepthMap'].texture);
        this.bgDepthMap.width = this.bg.width;
        this.bgDepthMap.height = this.bg.height;
        this.app.stage.addChild(this.bgDepthMap);
        this.depthMap = new PIXI.filters.DisplacementFilter(this.bgDepthMap);
        this.app.stage.filters.push(this.depthMap);
        for (const school of Object.values(this.fishSchools)) {
            if (Array.isArray(school)) {
                school.forEach(fish => this.app.stage.addChild(fish.getRenderableObject()));
            } else {
                this.app.stage.addChild(school.getRenderableObject());
            }
        }
    };

    handleAddFish = e => {
        const key = e.target.getAttribute('data-id');
        switch (key) {
            case 'fish1':
            case 'fish2':
            case 'fish4':
            case 'fish6':
                if (this.fishSchools.hasOwnProperty(key)) {
                    this.fishSchools[key].addFish();
                } else {
                    const { width, velocity, number, layer } = PARAMS[key];
                    this.fishSchools[key] = new FishSchool(this.props.resources[key].texture, width, velocity, number, layer);
                    this.app.stage.addChild(this.fishSchools[key].getRenderableObject());
                }
                break;

            case 'fish3':
            case 'fish5': {
                if (!this.fishSchools.hasOwnProperty(key)) {
                    this.fishSchools[key] = [];
                }
                const { width, velocity, layer } = PARAMS[key];
                const fish = new GiantFish(this.props.resources[key].texture, width, velocity, layer);
                this.fishSchools[key].push(fish);
                this.app.stage.addChild(fish.getRenderableObject());
                break;
            }
        }
    };
}

function OptionList(props) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <div className='icon-wrapper' onClick={() => setOpen(!open)}>
                {open ? <CloseIcon/> : <InfoIcon/>}
            </div>
            {open && props.children}
        </>
    );
}

function Menu(props) {
    const [activeMenu, setActiveMenu] = useState('main');
    const [menuHeight, setMenuHeight] = useState(0);
    const menuRef = useRef();

    useEffect(() => {
        setMenuHeight(menuRef.current?.firstChild.offsetHeight);
    }, []);

    function calcHeight(el) {
        setMenuHeight(el.offsetHeight);
    }

    return (
        <div className='menu' style={{ height: menuHeight }} ref={menuRef}>
            <CSSTransition in={activeMenu === 'main'}
                timeout={6e2}
                classNames='menu-primary'
                unmountOnExit
                onEnter={calcHeight}>
                <ul className='sub-menu'>
                    {props.options.map(option => <li key={option} className='option' onClick={() => setActiveMenu(option)}>
                        {option}
                    </li>)}
                </ul>
            </CSSTransition>
            {props.children.map((child, i) => <CSSTransition key={i}
                in={activeMenu === props.options[i]}
                timeout={6e2}
                classNames='menu-secondary'
                unmountOnExit
                onEnter={calcHeight}>
                <ul className='sub-menu'>
                    <li className='option align-left' onClick={() => setActiveMenu('main')}>
                        ⬅ Go Back
                    </li>
                    {child}
                </ul>
            </CSSTransition>)}
        </div>
    );
}

export default Aquarium;
