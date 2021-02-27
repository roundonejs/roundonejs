export function createActionChangeState(action) {
    let changeState = function(player) {
        if (player.action !== action) {
            player.action = action;
            player.currentFrame = 0;
            player.currentTime = 0;
        }
    };
    return changeState;
}
