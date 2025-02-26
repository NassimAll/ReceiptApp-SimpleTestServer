export interface Receipt {
    id: number;
    restaurantName: string;
    address: string;
    totalSpent: number;
    receiptDate: Date;
    uploadDate: Date;
    imagePath: string;
    user_id: string;
  }
