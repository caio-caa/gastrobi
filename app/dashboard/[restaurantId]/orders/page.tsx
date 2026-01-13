'use client';

export default function OrdersPage({
  params,
}: {
  params: { restaurantId: string };
}) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Pedidos</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">
          Gerenciamento de pedidos em desenvolvimento...
        </p>
      </div>
    </div>
  );
}
