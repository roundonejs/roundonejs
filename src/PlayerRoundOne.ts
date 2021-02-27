import {Player} from 'roundonejs_mugen_renderer';
import {Control} from './control';
import {Character} from './character';

export class PlayerRoundOne extends Player {
    control: Control;
    buttonPressed: () => void;
    character: Character;
}
