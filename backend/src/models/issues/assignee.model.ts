export default  class  Assignee{
    name :string;
    email:string;
    assignedAt: number;

    constructor(name:string , email:string) {
        this.name = name;
        this.email= email;
        this.assignedAt = new Date().getTime()
    }
}