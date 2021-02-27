export function createConditionCommandExecuted(commandName) {
    let commandExecuted = function(player) {
        let characterCommands = player.character.commands;
        let pressedButtons = player.control.pressedButtons;
        let characterCommand = null;

        for (let i = 0, length = characterCommands.length; i < length; i++) {
            let currentCommand = characterCommands[i];
            if (currentCommand.name === commandName) {
                characterCommand = currentCommand;
            }
        }
        if (characterCommand.command.length > pressedButtons.length) {
            return false
        }
        for (
            let i = 0, length = characterCommand.command.length;
            i < length;
            i++
        ) {
            let command = characterCommand.command[i];
            let pressedButton = pressedButtons[pressedButtons.length - 1 - i];
            if (!(
                (
                    (command.hold === pressedButton.hold)
                    || (command.hold && pressedButton.currentHold)
                )
                && (
                    (command.keys[0] === pressedButton.buttons[0])
                    || (command.keys[0] === '')
                )
            )) {
                return false;
            }
        }
        return true;
    };
    return commandExecuted;
}
