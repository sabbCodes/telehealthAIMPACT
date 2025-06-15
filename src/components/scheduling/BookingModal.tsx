import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Video, MessageCircle, DollarSign } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { Doctor } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface BookingModalProps {
  doctor: Doctor;
  isOpen: boolean;
  onClose: () => void;
  onBook: (bookingData: {
    date: Date;
    duration: number;
    notes?: string;
  }) => void;
  isLoading?: boolean;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  doctor,
  isOpen,
  onClose,
  onBook,
  isLoading = false,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [consultationType, setConsultationType] = useState<'VIDEO' | 'CHAT'>('VIDEO');
  const [symptoms, setSymptoms] = useState('');

  // Generate next 7 days for booking
  const availableDates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1));

  // Mock available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  const handleBook = () => {
    if (!selectedDate || !selectedTime) return;

    const bookingData = {
      date: new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`),
      duration: 30, // Default duration in minutes
      notes: symptoms,
    };

    onBook(bookingData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Book Consultation</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Doctor Info */}
            <Card className="mb-6">
              <div className="p-4 flex items-center space-x-4">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.id}`}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold text-white">Dr. {doctor.name}</h3>
                  <p className="text-blue-400">{doctor.specialty}</p>
                  <p className="text-gray-400 text-sm">{doctor.location}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-2xl font-bold text-white">{doctor.consultationFee} SOL</p>
                  <p className="text-gray-400 text-sm">per consultation</p>
                </div>
              </div>
            </Card>

            {/* Consultation Type */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Consultation Type</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setConsultationType('VIDEO')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    consultationType === 'VIDEO'
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-gray-600 bg-gray-700'
                  }`}
                >
                  <Video className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-white font-medium">Video Call</p>
                  <p className="text-gray-400 text-sm">Face-to-face consultation</p>
                </button>
                <button
                  onClick={() => setConsultationType('CHAT')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    consultationType === 'CHAT'
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-gray-600 bg-gray-700'
                  }`}
                >
                  <MessageCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-white font-medium">Text Chat</p>
                  <p className="text-gray-400 text-sm">Message-based consultation</p>
                </button>
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Select Date</h3>
              <div className="grid grid-cols-7 gap-2">
                {availableDates.map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      selectedDate?.toDateString() === date.toDateString()
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="text-xs">{format(date, 'EEE')}</div>
                    <div className="text-lg font-semibold">{format(date, 'd')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Select Time</h3>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 rounded-lg text-center transition-colors ${
                        selectedTime === time
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Symptoms */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Describe Your Symptoms</h3>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Please describe your symptoms and any relevant medical history..."
                className="w-full h-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Booking Summary */}
            <Card className="mb-6">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Doctor:</span>
                    <span className="text-white">Dr. {doctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white">{consultationType === 'VIDEO' ? 'Video Call' : 'Text Chat'}</span>
                  </div>
                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date:</span>
                      <span className="text-white">{format(selectedDate, 'MMM d, yyyy')}</span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time:</span>
                      <span className="text-white">{selectedTime}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-600 pt-2 mt-2">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-white font-semibold">{doctor.consultationFee} SOL</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBook}
                disabled={!selectedDate || !selectedTime || isLoading}
                className="flex-1"
              >
                {isLoading ? 'Processing Payment...' : 'Book Consultation'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
