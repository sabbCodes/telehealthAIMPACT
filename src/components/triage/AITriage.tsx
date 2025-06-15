import { motion } from 'framer-motion';
import { Brain, Send, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AITriageResult } from '../../types';

export const AITriage: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AITriageResult | null>(null);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockResult: AITriageResult = {
        suggestedSpecialty: 'Cardiology',
        urgencyLevel: 'medium',
        recommendedDoctors: [],
        reasoning: 'Based on your symptoms of chest pain and shortness of breath, I recommend consulting with a cardiologist. These symptoms could indicate various heart-related conditions that require professional evaluation.'
      };
      setResult(mockResult);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'emergency': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case 'low': return CheckCircle;
      case 'medium': 
      case 'high': 
      case 'emergency': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-10 h-10 text-purple-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">AI Health Triage</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Describe your symptoms and our AI will help you understand what type of specialist you should consult with.
        </p>
      </motion.div>

      <Card className="mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Describe your symptoms in detail
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Please describe what you're experiencing, including when symptoms started, severity, and any other relevant details..."
              className="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
          
          <Button
            onClick={handleAnalyze}
            disabled={!symptoms.trim() || isAnalyzing}
            isLoading={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? 'Analyzing symptoms...' : 'Analyze Symptoms'}
            {!isAnalyzing && <Send className="ml-2 w-4 h-4" />}
          </Button>
        </div>
      </Card>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Analysis Results</h3>
                <div className={`flex items-center space-x-2 ${getUrgencyColor(result.urgencyLevel)}`}>
                  {(() => {
                    const Icon = getUrgencyIcon(result.urgencyLevel);
                    return <Icon className="w-5 h-5" />;
                  })()}
                  <span className="font-medium capitalize">{result.urgencyLevel} Priority</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Recommended Specialty</h4>
                  <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-4">
                    <p className="text-blue-400 font-semibold text-lg">{result.suggestedSpecialty}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Urgency Level</h4>
                  <div className={`bg-gray-700 rounded-lg p-4 border-l-4 ${
                    result.urgencyLevel === 'emergency' ? 'border-red-400' :
                    result.urgencyLevel === 'high' ? 'border-orange-400' :
                    result.urgencyLevel === 'medium' ? 'border-yellow-400' :
                    'border-green-400'
                  }`}>
                    <p className={`font-semibold capitalize ${getUrgencyColor(result.urgencyLevel)}`}>
                      {result.urgencyLevel} Priority
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-white mb-2">AI Reasoning</h4>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-300 leading-relaxed">{result.reasoning}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1">
                  Find {result.suggestedSpecialty} Doctors
                </Button>
                <Button variant="outline" className="flex-1">
                  Get Second Opinion
                </Button>
              </div>

              {result.urgencyLevel === 'emergency' && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-red-400 mb-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-semibold">Emergency Alert</span>
                  </div>
                  <p className="text-red-300">
                    Your symptoms suggest you may need immediate medical attention. 
                    Please consider visiting an emergency room or calling emergency services.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
