var WHITE_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-white.svg';

window.TrelloPowerUp.initialize({
    'board-buttons': async function (t) {
        return [{
            // we can either provide a button that has a callback function
            // that callback function should probably open a popup, overlay, or boardBar
            icon: WHITE_ICON,
            text: 'TEST POPUP',
            condition: 'always',
            callback: () => null as any
        }]
    }
})
