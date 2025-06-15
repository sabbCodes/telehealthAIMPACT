import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Video, MessageCircle, GraduationCap } from 'lucide-react';
import { Doctor } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface DoctorCardProps {
  doctor: Doctor;
  onSelect: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelect }) => {
  return (
    <Card className="group cursor-pointer" hover>
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.id}`}
            alt={doctor.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          {doctor.verified && (
            <div className="absolute -top-1 -right-1 bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                Dr. {doctor.name}
              </h3>
              <p className="text-blue-400 text-sm font-medium">{doctor.specialty}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">{doctor.rating}</span>
              </div>
              <p className="text-gray-400 text-sm">{doctor.experience} years</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{doctor.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <GraduationCap className="w-4 h-4" />
              <span>{doctor.education}</span>
            </div>
          </div>

          {doctor.bio && (
            <p className="text-gray-400 text-sm mt-3 line-clamp-2">
              {doctor.bio}
            </p>
          )}

          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-2xl font-bold text-white">{doctor.consultationFee} SOL</span>
              <span className="text-gray-400 text-sm ml-1">/ consultation</span>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelect(doctor)}
                className="flex items-center space-x-1"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </Button>
              <Button
                size="sm"
                onClick={() => onSelect(doctor)}
                className="flex items-center space-x-1"
              >
                <Video className="w-4 h-4" />
                <span>Video</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
