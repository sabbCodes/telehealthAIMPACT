import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Doctor } from '../../types';
import { DoctorCard } from './DoctorCard';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface DoctorListProps {
  onSelectDoctor: (doctor: Doctor) => void;
}

export const DoctorList: React.FC<DoctorListProps> = ({ onSelectDoctor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [specialties, setSpecialties] = useState<string[]>([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          doctor_profiles!inner (
            specialty,
            experience,
            location,
            consultation_fee,
            is_verified,
            bio,
            education
          )
        `)
        .eq('doctor_profiles.is_verified', true)
        .order('name');

      if (error) throw error;

      // Transform the data to match our Doctor type
      const transformedDoctors: Doctor[] = data.map((doctor: any) => ({
        id: doctor.id,
        name: doctor.name,
        specialty: doctor.doctor_profiles[0].specialty,
        experience: doctor.doctor_profiles[0].experience,
        rating: 4.5, // Default rating for now
        consultationFee: doctor.doctor_profiles[0].consultation_fee,
        location: doctor.doctor_profiles[0].location,
        verified: doctor.doctor_profiles[0].is_verified,
        bio: doctor.doctor_profiles[0].bio,
        education: doctor.doctor_profiles[0].education,
        availability: [], // We'll implement this later
      }));

      setDoctors(transformedDoctors);

      // Extract unique specialties
      const uniqueSpecialties = Array.from(
        new Set(transformedDoctors.map(d => d.specialty))
      );
      setSpecialties(['All', ...uniqueSpecialties]);
    } catch (error: any) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || selectedSpecialty === 'All' || 
                            doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Find a Doctor</h1>
        <p className="text-gray-400">Connect with qualified healthcare professionals worldwide</p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 rounded-xl p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search doctors by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {specialties.map((specialty) => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedSpecialty(specialty)}
              >
                {specialty}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Doctor Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6"
      >
        {filteredDoctors.map((doctor, index) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <DoctorCard doctor={doctor} onSelect={onSelectDoctor} />
          </motion.div>
        ))}
      </motion.div>

      {filteredDoctors.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-400 text-lg">No doctors found matching your criteria.</p>
        </motion.div>
      )}
    </div>
  );
};
