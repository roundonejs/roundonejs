export class Control {
    constructor(player, keyMaps) {
        this.player = player;
        this.player.control = this;
        this.keyMaps = keyMaps;
        this.pressedButtons = [];
        this.player.buttonPressed = function() {
            let character = player.character;
            for (
                let i = 0, length = character.statesEntries.length;
                i < length;
                i++
            ) {
                let stateEntry = character.statesEntries[i];
                if (stateEntry.execute(player)) {
                    break;
                }
            }
        };
    }

    static calculateTrick(startDate, endDate) {
        return Math.floor((startDate.getTime() - endDate.getTime())/60);
    }

    static addButton(buttons, newButton) {
        if (buttons.indexOf(newButton) === -1) {
            if (
                (['U', 'B', 'D', 'F'].indexOf(newButton) !== -1)
                && (buttons.length === 1)
                && (['a', 'b', 'c', 'x', 'y', 'z'].indexOf(buttons[0]) === -1)
            ) {
                if (
                    ((newButton === 'U') && (buttons[0] === 'B'))
                    || ((newButton === 'B') && (buttons[0] === 'U'))
                ) {
                    buttons[0] = 'UB';
                } else if (
                    ((newButton === 'U') && (buttons[0] === 'F'))
                    || ((newButton === 'F') && (buttons[0] === 'U'))
                ) {
                    buttons[0] = 'UF';
                } else if (
                    ((newButton === 'D') && (buttons[0] === 'B'))
                    || ((newButton === 'B') && (buttons[0] === 'D'))
                ) {
                    buttons[0] = 'DB';
                } else if (
                    ((newButton === 'D') && (buttons[0] === 'F'))
                    || ((newButton === 'F') && (buttons[0] === 'D'))
                ) {
                    buttons[0] = 'DF';
                }
                return ;
            } else {
                buttons.push(newButton);
            }
        }
    }

    convertEventKeyInButton(key) {
        let value = this.keyMaps[key];
        if (value === undefined) {
            return null;
        }
        return value;
    }

    keyEvent(event) {
        let button = this.convertEventKeyInButton(event.key);
        if (button !== null) {
            if (event.type === 'keydown') {
                this.buttonDown(button);
            } else if (event.type === 'keyup') {
                this.buttonUp(button);
            }
        }
    }

    buttonDown(button) {
        let date = new Date();
        let lastPressedButton;
        let currentPressedButton;

        if (this.pressedButtons.length > 0) {
            lastPressedButton = this.pressedButtons[
                this.pressedButtons.length - 1
            ];
        } else {
            lastPressedButton = null;
        }

        if (
            (lastPressedButton === null)
            || (lastPressedButton.dateReleased !== null)
            || (
                (Control.calculateTrick(date, lastPressedButton.dateDown) > 0)
                && (lastPressedButton.buttons.indexOf(button) === -1)
            )
        ) {
            if (
                (lastPressedButton != null)
                && (
                    Control.calculateTrick(date, lastPressedButton.dateDown) > 0
                )
            ) {
                lastPressedButton.hold = true;
            }
            currentPressedButton = {
                'buttons': [],
                'dateDown': date,
                'dateReleased': null,
                'currentHold': true,
                'hold': false,
                'release': {
                    active: false,
                    time: 0
                }
            };
            this.pressedButtons.push(currentPressedButton);
        } else {
            currentPressedButton = lastPressedButton;
        }
        Control.addButton(currentPressedButton.buttons, button);
        player.buttonPressed();
    }

    buttonUp(button) {
        let date = new Date();
        for (let i = this.pressedButtons.length - 1; i >= 0; i--) {
            let pressedButton = this.pressedButtons[i];
            if (pressedButton.buttons.indexOf(button) !== -1) {
                pressedButton.dateReleased = date;
                pressedButton.release.active = true;
                pressedButton.release.time = Control.calculateTrick(
                    date,
                    pressedButton.dateDown
                );
                pressedButton.currentHold = false;
                break;
            }
        }
        player.buttonPressed();
    }
}
