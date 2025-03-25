import StoreCustomerList from "@/components/dashboard/customers/StoreCustomerList";

export default function CustomersPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
      <StoreCustomerList />
    </div>
  );
} 