import { OrderStatus } from '@/lib/stores/types'

export const getStatusStyle = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800';
    case 'READY_FOR_PICKUP':
      return 'bg-purple-100 text-purple-800';
    case 'PICKED_UP':
      return 'bg-indigo-100 text-indigo-800';
    case 'IN_TRANSIT':
      return 'bg-orange-100 text-orange-800';
    case 'DELIVERED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    case 'FAILED_DELIVERY':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}; 