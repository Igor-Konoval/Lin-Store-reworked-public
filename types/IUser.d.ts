export interface IUserProfile {
	username: string
	email: string
	firstname: string
	lastname: string
	surname: string
	phone: number | undefined
	birthday: string | Date | null
}

export interface IGoogleAuth {
	username: string
	email: string
	uid: string
}

export interface IUserProfileComponent {
	show: boolean
	onHide: () => void
}
