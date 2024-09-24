import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Myevents = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrationsData, setRegistrationsData] = useState({});
  const [reviewsData, setReviewsData] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(collection(db, 'events'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const eventsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMyEvents(eventsList);

        const eventRegistrations = {};
        for (let event of eventsList) {
          const regQuery = query(collection(db, 'registrations'), where('eventId', '==', event.id));
          const regSnapshot = await getDocs(regQuery);

          const ticketCategoryCount = {};
          regSnapshot.docs.forEach(doc => {
            const { ticketCategory } = doc.data();
            if (ticketCategoryCount[ticketCategory]) {
              ticketCategoryCount[ticketCategory]++;
            } else {
              ticketCategoryCount[ticketCategory] = 1;
            }
          });

          eventRegistrations[event.id] = ticketCategoryCount;
        }
        setRegistrationsData(eventRegistrations);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchReviews = async (eventId) => {
    const reviewsQuery = query(collection(db, 'reviews'), where('eventId', '==', eventId));
    const reviewsSnapshot = await getDocs(reviewsQuery);
    const reviews = reviewsSnapshot.docs.map(doc => doc.data());
    setReviewsData((prev) => ({ ...prev, [eventId]: reviews }));
    setSelectedEvent(eventId);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">My Events</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-white bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700"
        >
          Back to Dashboard
        </button>
      </div>
      {myEvents.length === 0 ? (
        <p>No events created yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myEvents.map(event => (
            <div key={event.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-gray-800">{event.eventName}</h3>
              <p className="text-gray-600">{event.description}</p>
              <p className="flex items-center text-gray-600 mt-2">
                <span className="mr-2">📍</span> Type: {event.type}
              </p>
              <p className="flex items-center text-gray-600 mt-2">
                <span className="mr-2">👥</span> Audience: {event.audience}
              </p>

              <p className="text-gray-600 mt-2 font-semibold">Registrations by Ticket Category:</p>
              {registrationsData[event.id] ? (
                Object.keys(registrationsData[event.id]).map(category => (
                  <p key={category} className="text-gray-600 ml-4">
                    {category}: {registrationsData[event.id][category]} registrations
                  </p>
                ))
              ) : (
                <p className="text-gray-600 ml-4">No registrations yet.</p>
              )}

              <button
                onClick={() => fetchReviews(event.id)}
                className="text-white bg-indigo-500 px-4 py-2 rounded hover:bg-indigo-600 mt-4"
              >
                View Reviews
              </button>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Reviews for {myEvents.find(event => event.id === selectedEvent)?.eventName}</h3>
            
            {reviewsData[selectedEvent]?.length > 0 ? (
              reviewsData[selectedEvent].map((review, index) => (
                <div key={index} className="mb-4">
                  <p className="text-gray-700"><strong>Review:</strong> {review.review}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No reviews yet.</p>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Myevents;
