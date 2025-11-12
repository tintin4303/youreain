// src/app/admin/components/ApartmentList.jsx

export default function ApartmentList({ apartments, onEdit, onDelete }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {apartments.map((apt) => (
        <div key={apt._id} className="glass rounded-2xl p-5 shadow-md">
          <img
            src={apt.images[0] || "/placeholder.jpg"}
            alt={apt.title}
            className="w-full h-48 object-cover rounded-xl mb-4"
          />
          <h3 className="font-bold text-lg">{apt.title}</h3>
          <p className="text-indigo-600 font-medium">฿{apt.price.toLocaleString()}/mo</p>
          <p className="text-sm text-gray-600">{apt.location}</p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onEdit(apt)}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(apt._id)}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}