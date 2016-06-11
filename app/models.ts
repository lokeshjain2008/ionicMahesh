export interface UserModel{
	email: string,
  profileImageURL: string,
  displayName: string,
  userId: string,
  role?: string,
}

export interface MenuModel{
	price: number,
	name: string,
	desc: string,
	available: boolean

}


export enum OrderStatusEnum{
	"created",
	"Processing",
	"complete",
	"paid",
}

export interface OrderModel{
	items: any[],
	amount: number,
	status: OrderStatusEnum
}