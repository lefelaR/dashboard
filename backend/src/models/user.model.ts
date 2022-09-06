export default class User {
	id: string = "";
	firstName: string = "";
	lastName: string = "";
	email: string = "";
	avatar: string = User.DefaultAvatar;
	roles: string[] = [];
	department: string = "";
	createdAt: number = 0;
	lastLoggedIn: number = 0;
	isActive: boolean = true;
	static DefaultAvatar: string = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
	constructor(id) {
		this.id = id;
	}
}
