import { motion } from 'framer-motion';
import { Star, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export const DoctorShowcase: React.FC = () => {
  const navigate = useNavigate();

  const featuredDoctors = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      rating: 4.9,
      consultations: 1250,
      location: 'New York, USA',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      fee: 0.5,
      nextAvailable: '2 hours'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Dermatology',
      rating: 4.8,
      consultations: 890,
      location: 'Singapore',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      fee: 0.3,
      nextAvailable: '1 hour'
    },
    {
      id: '3',
      name: 'Dr. Priya Patel',
      specialty: 'Pediatrics',
      rating: 4.9,
      consultations: 2100,
      location: 'Mumbai, India',
      avatar: 'https://images.unsplash.com/photo-1594824475317-d3e2b4e3e5e5?w=150&h=150&fit=crop&crop=face',
      fee: 0.2,
      nextAvailable: 'Available now'
    }
  ];

  return (
    <section id="doctors" className="py-20 bg-gray-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Meet Our Top Doctors
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Connect with world-class healthcare professionals from around the globe
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {featuredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="text-center">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-white mb-1">{doctor.name}</h3>
                <p className="text-blue-400 mb-3">{doctor.specialty}</p>
                
                <div className="flex items-center justify-center space-x-4 mb-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{doctor.rating}</span>
                  </div>
                  <div>{doctor.consultations} consultations</div>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-center space-x-1 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{doctor.location}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{doctor.nextAvailable}</span>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-white">{doctor.fee} SOL</span>
                  <span className="text-gray-400 text-sm ml-1">per consultation</span>
                </div>

                <Button size="sm" className="w-full">
                  Book Consultation
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate('/doctors')}
          >
            View All Doctors
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
