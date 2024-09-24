import React, { useState } from 'react';
import { auth, db } from '../utils/firebase';  // Firebase auth and Firestore imports
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Create = () => {
  const navigate = useNavigate();
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('In Person');
  const [audience, setAudience] = useState('');
  const [date, setDate] = useState('');
  
  // State for seat categories and prices
  const [seats, setSeats] = useState([{ category: '', price: '' }]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      await addDoc(collection(db, 'events'), {
        eventName,
        description,
        type,
        audience,
        date,
        registrations: 0, // Initialize registrations count to 0
        createdAt: new Date(),
        userId: user.uid,
        seats // Store the seat categories and prices
      });

      alert('Event created successfully!');
      
      // Optionally clear form fields after successful creation
      setEventName('');
      setDescription('');
      setType('In Person');
      setAudience('');
      setDate('');
      setSeats([{ category: '', price: '' }]);
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error creating event: ' + error.message);
    }
  };

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  // Handle adding new seat category
  const handleAddSeat = () => {
    setSeats([...seats, { category: '', price: '' }]);
  };

  // Handle seat category and price change
  const handleSeatChange = (index, field, value) => {
    const updatedSeats = seats.map((seat, i) =>
      i === index ? { ...seat, [field]: value } : seat
    );
    setSeats(updatedSeats);
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Create an Event</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="In Person">In Person</option>
            <option value="Virtual">Virtual</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Audience</label>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Seats and Prices Section */}
        <div className="mb-4">
          <label className="block text-gray-700">Seat Categories & Prices</label>
          {seats.map((seat, index) => (
            <div key={index} className="flex space-x-4 mb-2">
              <input
                type="text"
                placeholder="Category"
                value={seat.category}
                onChange={(e) => handleSeatChange(index, 'category', e.target.value)}
                className="w-1/2 p-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Price"
                value={seat.price}
                onChange={(e) => handleSeatChange(index, 'price', e.target.value)}
                className="w-1/2 p-2 border border-gray-300 rounded-md"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSeat}
            className="mt-2 text-blue-500"
          >
            + Add another seat category
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-500"
        >
          Create Event
        </button>
      </form>

      <button
        onClick={handleBackClick}
        className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Create;
