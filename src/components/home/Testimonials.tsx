import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: '1',
      name: 'Adaora Okafor',
      location: 'Lagos, Nigeria',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: 'Living in a remote area, I never thought I could access quality healthcare. teleHealthSol connected me with an amazing cardiologist who helped diagnose my condition early. The blockchain security gives me peace of mind about my medical data.',
      condition: 'Heart condition diagnosis'
    },
    {
      id: '2',
      name: 'James Ochieng',
      location: 'Nairobi, Kenya',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: 'As a father of three, finding time to visit doctors was always challenging. The 24/7 availability and instant payments with crypto made healthcare so much more accessible for my family.',
      condition: 'Family healthcare'
    },
    {
      id: '3',
      name: 'Dr. Maria Santos',
      location: 'São Paulo, Brazil',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: 'As a doctor, I love how teleHealthSol allows me to help patients globally while ensuring secure, transparent transactions. The platform has expanded my practice beyond geographical boundaries.',
      condition: 'Healthcare provider'
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real stories from patients and doctors who've experienced the future of healthcare
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-blue-400/30" />
              
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-300 leading-relaxed mb-4">
                "{testimonial.text}"
              </p>

              <div className="text-sm text-blue-400 font-medium">
                {testimonial.condition}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
