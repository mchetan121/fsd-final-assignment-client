export class ResponseModel {

    statusCode: number;
    message: string;
    

    idVariable: number;
    extraVariable: string;
    respObject: any;
    respList: Array<any>;
    respArray: String[];

    constructor(statusCode, message, idVariable, extraVariable, respObject, respList, respArray) {
        this.statusCode = statusCode;
        this.message = message;
        this.idVariable = idVariable
        this.extraVariable = extraVariable
        this.respObject = respObject
        this.respList = respList
        this.respArray = respArray
    }
}