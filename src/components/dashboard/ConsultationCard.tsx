import { motion } from 'framer-motion';
import { Calendar, Clock, Video, MessageCircle, User } from 'lucide-react';
import { format } from 'date-fns';
import { Consultation } from '../../types';
import { Button } from '../ui/Button';

interface ConsultationCardProps {
  consultation: Consultation;
  userType: 'DOCTOR' | 'PATIENT';
}

export const ConsultationCard: React.FC<ConsultationCardProps> = ({ 
  consultation, 
  userType 
}) => {
  const otherUser = userType === 'DOCTOR' ? consultation.patient : consultation.doctor;
  const isUpcoming = new Date(consultation.scheduledAt) > new Date();
  const isToday = format(new Date(consultation.scheduledAt), 'yyyy-MM-dd') === 
                  format(new Date(), 'yyyy-MM-dd');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'text-blue-400 bg-blue-400/20';
      case 'IN_PROGRESS': return 'text-green-400 bg-green-400/20';
      case 'COMPLETED': return 'text-gray-400 bg-gray-400/20';
      case 'CANCELLED': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-700 rounded-lg p-4 border border-gray-600"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={otherUser.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.walletAddress}`}
            alt={otherUser.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h4 className="text-white font-medium">
              {userType === 'DOCTOR' ? otherUser.name : `Dr. ${otherUser.name}`}
            </h4>
            {userType === 'PATIENT' && otherUser.doctor && (
              <p className="text-gray-400 text-sm">{otherUser.doctor.specialty}</p>
            )}
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
          {consultation.status.replace('_', ' ')}
        </span>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(consultation.scheduledAt), 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{format(new Date(consultation.scheduledAt), 'HH:mm')}</span>
        </div>
        <div className="flex items-center space-x-1">
          {consultation.type === 'VIDEO' ? (
            <Video className="w-4 h-4" />
          ) : (
            <MessageCircle className="w-4 h-4" />
          )}
          <span>{consultation.type}</span>
        </div>
      </div>

      {consultation.symptoms && (
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
          <span className="font-medium">Symptoms:</span> {consultation.symptoms}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-white font-semibold">${consultation.fee}</span>
        <div className="flex space-x-2">
          {isUpcoming && (
            <>
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-1" />
                Chat
              </Button>
              {consultation.type === 'VIDEO' && isToday && (
                <Button size="sm">
                  <Video className="w-4 h-4 mr-1" />
                  Join
                </Button>
              )}
            </>
          )}
          {consultation.status === 'COMPLETED' && (
            <Button variant="outline" size="sm">
              View Details
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
