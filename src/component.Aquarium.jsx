import React, { useEffect } from 'react';

import * as PIXI from 'pixi.js';
import GiantFish from './class.GiantFish';
import FishSchool from './class.FishSchool';

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

        // background
        const bg = new PIXI.Sprite(props.resources.bg.texture);
        bg.width = window.innerWidth;
        bg.height = window.innerHeight;
        app.stage.addChild(bg);
        // ripple
        const bgFilter = new PIXI.Sprite(props.resources.bgFilter.texture);
        const ripple = new PIXI.filters.DisplacementFilter(bgFilter);
        bgFilter.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        app.stage.addChild(bgFilter);
        app.stage.filters.push(ripple);
        // depth map
        const bgDepthMap = new PIXI.Sprite(props.resources.bgDepthMap.texture);
        bgDepthMap.width = bg.width;
        bgDepthMap.height = bg.height;
        app.stage.addChild(bgDepthMap);
        const depthMap = new PIXI.filters.DisplacementFilter(bgDepthMap);
        app.stage.filters.push(depthMap);

        // give me fish!
        const fishSchools = [];
        fishSchools.push(new FishSchool(props.resources.fish1.texture, 30, [2, 3], 30, 1));
        fishSchools.push(new FishSchool(props.resources.fish4.texture, 50, [2, 3], 15, 2));
        fishSchools.push(new FishSchool(props.resources.fish6.texture, 20, [1, 2], 50, 0));
        for (let i = 0; i < 5; i++) {
            fishSchools.push(new GiantFish(props.resources.fish3.texture, 100, [1, 2], 3));
        }
        for (let i = 0; i < 2; i++) {
            fishSchools.push(new GiantFish(props.resources.fish5.texture, 200, [0.6, 1.2], 4));
        }
        for (const school of fishSchools) {
            app.stage.addChild(school.getRenderableObject());
        }

        // window events
        window.addEventListener('mousemove', e => {
            depthMap.scale.x = (window.innerWidth / 2 - e.clientX) / 20;
            depthMap.scale.y = (window.innerHeight / 2 - e.clientY) / 20;
        });
        window.addEventListener('resize', () => {
            bg.width = window.innerWidth;
            bg.height = window.innerHeight;
            bgDepthMap.width = bg.width;
            bgDepthMap.height = bg.height;
            app.renderer.resize(window.innerWidth, window.innerHeight);
        });

        // call the animate function
        animate();

        function animate() {
            bgFilter.x += 2;
            bgFilter.y += 1;
            fishSchools.forEach(school => school.update());
            requestAnimationFrame(animate);
        }
    }, []);

    return (
        <div id='aquarium'/>
    );
};
