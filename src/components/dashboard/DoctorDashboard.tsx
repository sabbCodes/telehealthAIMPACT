import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, DollarSign, Clock, MessageCircle, Video } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Consultation } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConsultationCard } from './ConsultationCard';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayConsultations: 0,
    monthlyEarnings: 0,
    averageRating: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [consultationsRes, statsRes] = await Promise.all([
        fetch('/api/consultations/doctor'),
        fetch('/api/dashboard/doctor/stats'),
      ]);

      if (consultationsRes.ok) {
        const consultationsData = await consultationsRes.json();
        setConsultations(consultationsData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const upcomingConsultations = consultations.filter(
    c => c.status === 'SCHEDULED' && new Date(c.scheduledAt) > new Date()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, Dr. {user?.name}
        </h1>
        <p className="text-gray-400">Here's what's happening with your practice today</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Patients</p>
                <p className="text-2xl font-bold text-white">{stats.totalPatients}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Today's Consultations</p>
                <p className="text-2xl font-bold text-white">{stats.todayConsultations}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Monthly Earnings</p>
                <p className="text-2xl font-bold text-white">${stats.monthlyEarnings}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Average Rating</p>
                <p className="text-2xl font-bold text-white">{stats.averageRating.toFixed(1)}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-400" />
            </div>
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
              <h2 className="text-xl font-semibold text-white mb-4">Upcoming Consultations</h2>
              <div className="space-y-4">
                {upcomingConsultations.length > 0 ? (
                  upcomingConsultations.map((consultation) => (
                    <ConsultationCard
                      key={consultation.id}
                      consultation={consultation}
                      userType="DOCTOR"
                    />
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    No upcoming consultations scheduled
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Set Availability
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  View All Patients
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Messages
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Earnings Report
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
