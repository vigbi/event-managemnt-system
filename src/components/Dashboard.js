import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, getDocs, doc, updateDoc, increment, query, where } from 'firebase/firestore';

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null); // For the selected event
  const [selectedTicket, setSelectedTicket] = useState(''); // For the selected ticket category
  const [price, setPrice] = useState(null); // For the selected ticket price
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false); // Review Modal state
  const [reviewText, setReviewText] = useState(''); // Review input

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Sign out error:", error.message);
      alert("Error signing out: " + error.message);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsQuerySnapshot = await getDocs(collection(db, 'events'));
        const eventsList = eventsQuerySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventsList);
        setFilteredEvents(eventsList);

        const user = auth.currentUser;
        if (user) {
          const registrationsQuery = query(
            collection(db, 'registrations'),
            where('userId', '==', user.uid)
          );
          const registrationsSnapshot = await getDocs(registrationsQuery);
          const registeredEventIds = registrationsSnapshot.docs.map(doc => doc.data().eventId);

          const registeredMap = {};
          registeredEventIds.forEach(eventId => {
            registeredMap[eventId] = true;
          });
          setRegisteredEvents(registeredMap);
        }
      } catch (error) {
        console.error("Error fetching events or registrations:", error.message);
      }
    };

    fetchEvents();
  }, []);

  const handleRegister = (event) => {
    setSelectedEvent(event); // Set the selected event for ticketing
    setIsModalOpen(true); // Open the modal
  };

  const confirmRegistration = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        alert('You must be logged in to register!');
        return;
      }

      if (!selectedTicket) {
        alert('Please select a ticket category!');
        return;
      }

      const eventRef = doc(db, 'events', selectedEvent.id);
      await updateDoc(eventRef, {
        registrations: increment(1)
      });

      await addDoc(collection(db, 'registrations'), {
        userId: user.uid,
        eventId: selectedEvent.id,
        ticketCategory: selectedTicket,
        price: price
      });

      setRegisteredEvents((prev) => ({
        ...prev,
        [selectedEvent.id]: true
      }));

      setIsModalOpen(false); // Close modal
      alert('Registered successfully!');
    } catch (error) {
      console.error("Error registering for event:", error.message);
      alert("Error registering: " + error.message);
    }
  };

  const handleTicketChange = (e) => {
    const selectedCategory = e.target.value;
    setSelectedTicket(selectedCategory);
    const selectedSeat = selectedEvent.seats.find(seat => seat.category === selectedCategory);
    setPrice(selectedSeat ? selectedSeat.price : null);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === '') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event =>
        event.eventName.toLowerCase().includes(query)
      );
      setFilteredEvents(filtered);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        alert('You must be logged in to submit a review!');
        return;
      }

      if (!reviewText) {
        alert('Please write a review before submitting!');
        return;
      }

      await addDoc(collection(db, 'reviews'), {
        userId: user.uid,
        eventId: selectedEvent.id,
        review: reviewText,
        date: new Date()
      });

      setIsReviewModalOpen(false); // Close the modal
      alert('Review submitted successfully!');
      setReviewText(''); // Clear the review text
    } catch (error) {
      console.error("Error submitting review:", error.message);
      alert("Error submitting review: " + error.message);
    }
  };

  return (
    <div className="h-screen bg-gray-100">
      <nav className="bg-white p-4 shadow-md">
        <div className="flex justify-between items-center container mx-auto">
          <div className="text-2xl font-bold text-indigo-600">Event Management System</div>
          <div className="flex items-center space-x-4 px-4">
            <input
              type="text"
              placeholder="Search..."
              autoComplete="off"
              value={searchQuery}
              onChange={handleSearch}
              className="rounded-md bg-white border-gray-200 border-2 text-grey-800 p-1 w-28 focus:bg-white focus:w-64 transition-all duration-500"
            />
            <button
              className="text-gray-700 hover:text-indigo-600"
              onClick={() => navigate('/my-events')}
            >
              My Events
            </button>
            <button
              className="text-white bg-pink-500 px-4 py-2 rounded hover:bg-pink-600"
              onClick={() => navigate('/create-event')}
            >
              Create Event
            </button>
            <button
              onClick={handleSignOut}
              className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto mt-10">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">All Active Events</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.length === 0 ? (
            <p className="text-gray-600">No events match your search.</p>
          ) : (
            filteredEvents.map(event => (
              <div key={event.id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-gray-800">{event.eventName}</h3>
                <p className="text-gray-600">{event.description}</p>
                
                {/* Event Date */}
                <p className="text-gray-600 mt-2">
                  📅 Date: {new Date(event.date).toLocaleDateString()}
                </p>

                <p className="flex items-center text-gray-600 mt-2">
                  <span className="mr-2">📍</span> Type: {event.type}
                </p>
                <p className="flex items-center text-gray-600 mt-2">
                  <span className="mr-2">👥</span> Audience: {event.audience}
                </p>
                <p className="text-gray-600 mt-2">Registrations: {event.registrations}</p>
                <button
                  className={`mt-4 py-2 px-4 rounded ${registeredEvents[event.id] ? 'bg-gray-500 text-white' : 'bg-pink-500 text-white hover:bg-pink-600'}`}
                  onClick={() => handleRegister(event)}
                  disabled={registeredEvents[event.id]}
                >
                  {registeredEvents[event.id] ? 'Already Registered' : 'Register'}
                </button>

                {/* Review Button */}
                <button
                  className="mt-4 py-2 px-4 rounded bg-indigo-500 text-white hover:bg-indigo-600 ml-4"
                  onClick={() => {
                    setSelectedEvent(event); 
                    setIsReviewModalOpen(true);
                  }}
                >
                  Write a Review
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Ticket Selection Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Select Ticket for {selectedEvent.eventName}
            </h2>
            <div className="mb-4">
              <label htmlFor="ticket-category" className="block font-medium text-gray-700 mb-2">
                Ticket Category
              </label>
              <select
                id="ticket-category"
                value={selectedTicket}
                onChange={handleTicketChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select a category</option>
                {selectedEvent.seats.map(seat => (
                  <option key={seat.category} value={seat.category}>
                    {seat.category} - Rs.{seat.price}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-gray-800 font-semibold">Price: Rs.{price || 'N/A'}</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="py-2 px-4 bg-pink-500 text-white rounded hover:bg-pink-600"
                onClick={confirmRegistration}
              >
                Confirm Registration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Write a Review for {selectedEvent.eventName}
            </h2>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              placeholder="Write your review..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
            />
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setIsReviewModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="py-2 px-4 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                onClick={handleReviewSubmit}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
