export interface UserModel{
	email: string,
  profileImageURL: string,
  displayName: string,
  userId: string,
  role?: string,
}

export class MenuModel {
  price: number;
  name: string;
  desc: string;
  available: boolean;

  constructor (){
    this.available = true;
  }
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

export function  statusValues(){
	console.log(OrderStatusEnum);
	return Object.keys(OrderStatusEnum).filter(Number).map(key => {
		let obj = {
			[key]:OrderStatusEnum[key]
		}
		console.log(key);
		return obj;
	});
}

