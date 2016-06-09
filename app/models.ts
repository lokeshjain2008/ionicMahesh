export interface UserModel{
	email: string,
  profileImageURL: string,
  displayName: string,
  userId: string,
  role?: string,
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
	orderStatus: OrderStatusEnum
}