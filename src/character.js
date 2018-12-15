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

    addDefaultEntries() {
        this.commands.push(new Command('(Jump back (upwards))', '/UB', 1));
        this.commands.push(new Command('(Jump forwards (upwards))', '/UF', 1));
        
        this.commands.push(new Command('(Walking backwards)', '/B', 1));
        this.commands.push(new Command('(Walking forwards)', '/F', 1));
        this.commands.push(new Command('(Jump neutral (upwards))', '/U', 1));
        this.commands.push(new Command('(Crouching)', '/D', 1));
        this.commands.push(new Command('(Standing)', '', 1));
        
        this.statesEntries.push(new StateEntry(
            createActionChangeState(43),
            [createConditionCommandExecuted('(Jump back (upwards))')]
        ));
        this.statesEntries.push(new StateEntry(
            createActionChangeState(42),
            [createConditionCommandExecuted('(Jump forwards (upwards))')]
        ));
        
        this.statesEntries.push(new StateEntry(
            createActionChangeState(21),
            [createConditionCommandExecuted('(Walking backwards)')]
        ));
        this.statesEntries.push(new StateEntry(
            createActionChangeState(20),
            [createConditionCommandExecuted('(Walking forwards)')]
        ));
        this.statesEntries.push(new StateEntry(
            createActionChangeState(11),
            [createConditionCommandExecuted('(Crouching)')]
        ));
        this.statesEntries.push(new StateEntry(
            createActionChangeState(41),
            [createConditionCommandExecuted('(Jump neutral (upwards))')]
        ));
        this.statesEntries.push(new StateEntry(
            createActionChangeState(0),
            [createConditionCommandExecuted('(Standing)')]
        ));
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
