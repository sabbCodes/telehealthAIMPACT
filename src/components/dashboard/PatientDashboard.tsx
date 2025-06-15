import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Heart, Clock, Plus, Search } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Consultation, MedicalRecord } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConsultationCard } from './ConsultationCard';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [consultationsRes, recordsRes] = await Promise.all([
        fetch('/api/consultations/patient'),
        fetch('/api/medical-records'),
      ]);

      if (consultationsRes.ok) {
        const consultationsData = await consultationsRes.json();
        setConsultations(consultationsData);
      }

      if (recordsRes.ok) {
        const recordsData = await recordsRes.json();
        setMedicalRecords(recordsData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const upcomingConsultations = consultations.filter(
    c => c.status === 'SCHEDULED' && new Date(c.scheduledAt) > new Date()
  );

  const recentRecords = medicalRecords.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-400">Manage your health and upcoming appointments</p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <Card className="cursor-pointer hover:bg-gray-750 transition-colors">
          <div className="p-6 text-center">
            <Search className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Find a Doctor</h3>
            <p className="text-gray-400 text-sm">Search for specialists and book consultations</p>
          </div>
        </Card>

        <Card className="cursor-pointer hover:bg-gray-750 transition-colors">
          <div className="p-6 text-center">
            <Heart className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">AI Health Check</h3>
            <p className="text-gray-400 text-sm">Get AI-powered health recommendations</p>
          </div>
        </Card>

        <Card className="cursor-pointer hover:bg-gray-750 transition-colors">
          <div className="p-6 text-center">
            <Plus className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Emergency</h3>
            <p className="text-gray-400 text-sm">Get immediate medical assistance</p>
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upcoming Consultations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Upcoming Consultations</h2>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Book New
                </Button>
              </div>
              <div className="space-y-4">
                {upcomingConsultations.length > 0 ? (
                  upcomingConsultations.map((consultation) => (
                    <ConsultationCard
                      key={consultation.id}
                      consultation={consultation}
                      userType="PATIENT"
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No upcoming consultations</p>
                    <Button>Book Your First Consultation</Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Medical Records */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Recent Records</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {recentRecords.length > 0 ? (
                  recentRecords.map((record) => (
                    <div key={record.id} className="bg-gray-700 rounded-lg p-3">
                      <h4 className="text-white font-medium text-sm">{record.title}</h4>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(record.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No medical records yet</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Health Summary */}
          <Card className="mt-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Health Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Blood Type</span>
                  <span className="text-white">{user?.patient?.bloodType || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Allergies</span>
                  <span className="text-white text-sm">
                    {user?.patient?.allergies ? 'Yes' : 'None known'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Medications</span>
                  <span className="text-white text-sm">
                    {user?.patient?.medications ? 'Yes' : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
