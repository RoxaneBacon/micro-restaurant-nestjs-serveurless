export interface OrderItemPayment {
    _id: string
    timestamp: string //date-time format
    amount: number
    status: 'PENDING' | 'COMPLETED' | 'FAILED'
}