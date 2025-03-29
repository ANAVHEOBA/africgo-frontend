interface StorePageProps {
  params: {
    storeId: string;
  };
}

export default function StorePage({ params }: StorePageProps) {
  const storeId = params.storeId;
  
  return (
    <div>
      <h1>Store {storeId}</h1>
    </div>
  );
} 