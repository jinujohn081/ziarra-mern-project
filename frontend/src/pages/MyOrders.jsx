//
//
//
// with loading text
//
// import React, { useEffect, useState } from "react";

// const MyOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = () => {
//       const mockOrders = [
//         {
//           _id: "12345",
//           createdAt: new Date(),
//           shippingAddress: {
//             city: "New York",
//             country: "USA",
//           },
//           orderItems: [
//             {
//               name: "Product 1",
//               image: "https://picsum.photos/500/500?random=1",
//             },
//           ],
//           totalPrice: 100,
//           isPaid: true,
//         },
//         {
//           _id: "12",
//           createdAt: new Date(),
//           shippingAddress: {
//             city: "Laholm",
//             country: "Sweden",
//           },
//           orderItems: [
//             {
//               name: "Product 2",
//               image: "https://picsum.photos/500/500?random=2",
//             },
//           ],
//           totalPrice: 100,
//           isPaid: true,
//         },
//       ];

//       setOrders(mockOrders);
//       setLoading(false);
//     };

//     const timer = setTimeout(fetchOrders, 1000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="max-w-7xl mx-auto p-4 sm:p-6">
//       <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>

//       <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
//         <table className="w-full text-left text-gray-500">
//           <thead className="bg-gray-100 text-xs uppercase text-gray-700">
//             <tr>
//               <th className="px-4 py-3">Image</th>
//               <th className="px-4 py-3">Order ID</th>
//               <th className="px-4 py-3">Created</th>
//               <th className="px-4 py-3">Shipping Address</th>
//               <th className="px-4 py-3">Items</th>
//               <th className="px-4 py-3">Price</th>
//               <th className="px-4 py-3">Status</th>
//             </tr>
//           </thead>

//           <tbody>
//             {loading && (
//               <tr>
//                 <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
//                   Loading orders...
//                 </td>
//               </tr>
//             )}

//             {!loading && orders.length === 0 && (
//               <tr>
//                 <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
//                   You have no orders
//                 </td>
//               </tr>
//             )}

//             {!loading &&
//               orders.length > 0 &&
//               orders.map((order) => (
//                 <tr key={order._id} className="border-b hover:bg-gray-50">
//                   <td className="px-4 py-3">
//                     <img
//                       src={order.orderItems[0].image}
//                       alt={order.orderItems[0].name}
//                       className="w-10 h-10 rounded-lg object-cover"
//                     />
//                   </td>

//                   <td className="px-4 py-3 font-medium text-gray-900">
//                     {order._id}
//                   </td>

//                   <td className="px-4 py-3">
//                     {new Date(order.createdAt).toLocaleDateString()}{" "}
//                     {new Date(order.createdAt).toLocaleTimeString()}
//                   </td>

//                   <td className="px-4 py-3">
//                     {order.shippingAddress.city},{" "}
//                     {order.shippingAddress.country}
//                   </td>

//                   <td className="px-4 py-3">{order.orderItems.length}</td>

//                   <td className="px-4 py-3">${order.totalPrice}</td>

//                   <td className="px-4 py-3">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                         order.isPaid
//                           ? "bg-green-900 text-white"
//                           : "bg-red-100 text-red-700"
//                       }`}
//                     >
//                       {order.isPaid ? "Paid" : "Pending"}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };
// =========================================================================
// export default MyOrders;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockOrders = [
        {
          _id: "12345",
          createdAt: new Date(),
          shippingAddress: { city: "New York", country: "USA" },
          orderItems: [
            {
              name: "Product 1",
              image: "https://picsum.photos/500/500?random=1",
            },
          ],
          totalPrice: 100,
          isPaid: true,
        },
        {
          _id: "12",
          createdAt: new Date(),
          shippingAddress: { city: "Laholm", country: "Sweden" },
          orderItems: [
            {
              name: "Product 2",
              image: "https://picsum.photos/500/500?random=2",
            },
          ],
          totalPrice: 100,
          isPaid: true,
        },
      ];

      setOrders(mockOrders);
      setHasFetched(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500 table-auto">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Shipping Address</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {/* Render rows only after fetch */}
            {hasFetched &&
              orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.orderItems[0].name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-900">
                    {order._id}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(order.createdAt).toLocaleDateString()}{" "}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </td>

                  <td className="px-4 py-3">
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.country}
                  </td>

                  <td className="px-4 py-3">{order.orderItems.length}</td>

                  <td className="px-4 py-3">${order.totalPrice}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.isPaid
                          ? "bg-green-900 text-white"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}

            {/* Empty state (only after fetch) */}
            {hasFetched && orders.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500">
                  You have no orders
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrders;
