class Character {
    constructor(player) {
        this.player = player;
        this.player.character = this;
        let name = this.player.DEF.info.displayname;
        if (name.indexOf('"') === 0) {
            this.name = name.substr(1, name.length - 2);
        }
        this.commands = [];
        this.statesEntries = [];
    }
}

class Command {
    constructor(name, command, time) {
        this.name = name;
        this.command = Command.parseCommand(command);
        this.time = time;
    }

    static parseCommand(command) {
        let parsedCommand = [];
        let sequenceKeys = command.replace(/;.*/, '').replace(/\s+/g, '').split(
            ','
        );
        for (var i = 0, length = sequenceKeys.length; i < length; i++) {
            var sequenceKey = sequenceKeys[i];
            let hold = sequenceKey.indexOf('/') !== -1;
            let directionOnly = sequenceKey.indexOf('$') !== -1;
            let noOtherKeys = sequenceKey.indexOf('>') !== -1;
            let release = {
                active: sequenceKey.indexOf('~') !== -1,
                time: 0
            };
            let matchReleaseTime = sequenceKey.match(/\~[0-9]+/);
            if (matchReleaseTime !== null) {
                release.time = parseInt(matchReleaseTime[0].substr(1));
            }
            let keys = sequenceKey.replace(/[\/\$\>]/g, '').replace(
                /\~([0-9]+)?/g,
                ''
            ).split('+');

            parsedCommand.push({
                keys: keys,
                hold: hold,
                directionOnly: directionOnly,
                release: release,
                noOtherKeys: noOtherKeys
            });
        }
        return parsedCommand;
    }
}

class StateEntry {
    constructor(action, conditions) {
        this.action = action;
        this.conditions = conditions;
    }

    execute(player) {
        let conditions = this.conditions;
        for (let i = 0, length = conditions.length; i < length; i++) {
            let condition = conditions[i];
            if (!condition(player)) {
                return false;
            }
        }
        this.action(player);
        return true;
    }
}

module.exports = {
    Character: Character,
    Command: Command,
    StateEntry: StateEntry
};
