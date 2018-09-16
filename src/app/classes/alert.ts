import { AlertType } from './../enums/alert-type.enum';

export class Alert {
    text: string;
    type: AlertType;

    constructor(text, type = AlertType.Success) {
        this.text = text;
        this.type = type;
    }
}
