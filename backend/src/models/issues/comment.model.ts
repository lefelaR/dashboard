export default class Comment{
    message:String
    author:String
    createdAt:Number

    constructor(message:string,author:string){
        this.author=author;
        this.message = message;
        this.createdAt =new Date().getTime()
    }


}