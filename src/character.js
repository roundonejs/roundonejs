class Character {
    constructor(player) {
        this.player = player;
        let name = this.player.DEF.info.displayname;
        if (name.indexOf('"') === 0) {
            this.name = name.substr(1, name.length - 2);
        }
    }
}

module.exports = {
    Character: Character
};
