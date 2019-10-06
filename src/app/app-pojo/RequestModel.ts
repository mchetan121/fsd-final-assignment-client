export class RequestModel {

    userId: string;
    userType: any;
    idVariable: number;
    extraVariable: string;
    reqObject: any;
    reqList: Array<any>;
    reqArray: String[];
    

    constructor(userId, userType, idVariable, extraVariable, reqObject, reqList, reqArray) {
        this.userId = userId
        this.userType = userType
        this.idVariable = idVariable
        this.extraVariable = extraVariable
        this.reqObject = reqObject
        this.reqList = reqList
        this.reqArray = reqArray
        
    }
}