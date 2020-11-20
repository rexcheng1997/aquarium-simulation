const SPRITES = {
    bg1: window.innerWidth > window.innerHeight ? 'assets/bg1-landscape.jpg' : 'assets/bg1-portrait.jpg',
    bg1DepthMap: window.innerWidth > window.innerHeight ? 'assets/bg1-landscape.dm.png' : 'assets/bg1-portrait.dm.png',
    bg2: window.innerWidth > window.innerHeight ? 'assets/bg2-landscape.jpg' : 'assets/bg2-portrait.jpg',
    bg2DepthMap: window.innerWidth > window.innerHeight ? 'assets/bg2-landscape.dm.png' : 'assets/bg2-portrait.dm.png',
    bgFilter: 'assets/filter.jpg',
    fish1: 'assets/sprites/fishes/fish1.png',
    fish2: 'assets/sprites/fishes/fish2.png',
    fish3: 'assets/sprites/fishes/fish3.png',
    fish4: 'assets/sprites/fishes/fish4.png',
    fish5: 'assets/sprites/fishes/fish5.png',
    fish6: 'assets/sprites/fishes/fish6.png'
};

const PARAMS = {
    fish1: { width: 30, velocity: [2, 4], number: 20, layer: 1 },
    fish2: { width: 40, velocity: [1, 3], number: 10, layer: 2 },
    fish3: { width: 120, velocity: [1, 2], layer: 3 },
    fish4: { width: 50, velocity: [2, 3], number: 8, layer: 2 },
    fish5: { width: 200, velocity: [0.6, 1.2], layer: 4 },
    fish6: { width: 20, velocity: [1, 2], number: 50, layer: 0 }
};

export { SPRITES, PARAMS };
