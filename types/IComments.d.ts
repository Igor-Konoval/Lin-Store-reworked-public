export interface IComment {
	_id: string
	username: string
	userId: string
	rating: number
	isGetOrder: boolean
	sendTo: string
	isRemove: boolean
	isChanged: boolean
	commentData: string
	commentDate: string
	productId: string
	responseComments: IResponseCommentUser[]
}

export interface IResponseCommentUser extends IComment {
	commentUserId: string
}

export interface ICommentComponent {
	productId: string
	userId: string | null
	comments: IComment[]
	setComments: (a: IComment[]) => void
	setShowModal: (a: boolean) => void
	setChangeCommentData: (a: string) => void
	setCommentUserId: (a: string) => void
	setShowModalChangeComment: (a: boolean) => void
	setToggleShowRemoveComment: (a: boolean) => void
	setShowModalResponse: (a: boolean) => void
	setMainCommentUserId: (a: string) => void
	setSelectComUId: (a: string) => void
	setShowResponseToggle: (a: boolean) => void
}

export interface ICreateComment {
	show: boolean
	onHide: (a?: boolean) => void
	productId: string
	setCommentsProduct: (a: IComment[]) => void
}

export interface IChangeComment {
	show: boolean
	showChangeResponse: boolean
	onHide: () => void
	productId: string
	commentUserId: string
	changeCommentData: string
	responseCommentUserId: string
	setResponseCommentUserId: (value: string) => void
	setChangeCommentData: React.Dispatch<React.SetStateAction<string>>
	setCommentsProduct: React.Dispatch<React.SetStateAction<IComment[]>>
}

export interface ICreateResponseComment {
	show: boolean
	onHide: () => void
	productId: string
	commentUserId: string
	mainCommentUserId: string
	setCommentsProduct: React.Dispatch<React.SetStateAction<IComment[]>>
}

export interface IRemoveComment {
	show: boolean
	showRemoveResponse: boolean
	onHide: () => void
	responseCommentUserId: string
	productId: string
	commentUserId: string
	setCommentsProduct: React.Dispatch<React.SetStateAction<IComment[]>>
}

export interface IGetAllComments {
	username: string
	rating: number
	isGetOrder: boolean
	sendTo: string
	isRemove: boolean
	isChanged: boolean
	commentData: string
	commentDate: string
	responseComments: IResponseCommentUser[]
}

export interface IUserComments {
	_id: string
	userComments: IGetAllComments[]
	productName: string
	productId: string
	productTotalRating: number
	productCountRating: number
	productShortDescription: string
	productImg: string
	price: number
}
