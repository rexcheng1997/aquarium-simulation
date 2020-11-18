import React, { useEffect } from 'react';

import * as PIXI from 'pixi.js';

export default function Aquarium(props) {
    useEffect(() => {
        const app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: true
        });
        app.autoResize = true;
        app.renderer.view.style.transform = 'scale(1.02)';
        app.stage.filters = [];
        document.getElementById('aquarium').appendChild(app.view);

        const sprites = {};
        for (const key in props.resources) {
            sprites[key] = new PIXI.Sprite(props.resources[key].texture);
        }

        // background
        sprites.bg.width = window.innerWidth;
        sprites.bg.height = window.innerHeight;
        app.stage.addChild(sprites.bg);
        // ripple
        const ripple = new PIXI.filters.DisplacementFilter(sprites.bgFilter);
        sprites.bgFilter.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        app.stage.addChild(sprites.bgFilter);
        app.stage.filters.push(ripple);
        // depth map
        app.stage.addChild(sprites.bgDepthMap);
        const depthMap = new PIXI.filters.DisplacementFilter(sprites.bgDepthMap);
        app.stage.filters.push(depthMap);

        // window events
        window.addEventListener('mousemove', e => {
            depthMap.scale.x = (window.innerWidth / 2 - e.clientX) / 20;
            depthMap.scale.y = (window.innerHeight / 2 - e.clientY) / 20;
        });
        window.addEventListener('resize', () => {
            sprites.bg.width = window.innerWidth;
            sprites.bg.height = window.innerHeight;
            app.renderer.resize(window.innerWidth, window.innerHeight);
        });

        // call the animate function
        animate();

        function animate() {
            sprites.bgFilter.x += 2;
            sprites.bgFilter.y += 1;
            requestAnimationFrame(animate);
        }
    }, []);

    return (
        <div id='aquarium'/>
    );
};
