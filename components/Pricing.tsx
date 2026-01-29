"use client";

import { motion } from "framer-motion";
import { Check, MessageCircle } from "lucide-react";

const packages = [
  {
    name: "Starter Website",
    priceLabel: "Start from",
    price: "Rp. 700.000",
    features: ["One Page / Landing Page", "Responsive Design", "SEO Optimization", "1 Month Support"],
    popular: false,
    category: "Development"
  },
  {
    name: "Video Edit Basic",
    priceLabel: "Start from",
    price: "Rp. 250.000",
    features: ["Up to 5 min duration", "Basic Transitions", "Color Correction", "Royalty Free Music"],
    popular: true,
    category: "Video Editing"
  },
  {
    name: "Full Branding",
    priceLabel: "Start from",
    price: "Rp. 100.000",
    features: ["Logo Design", "Brand Guidelines", "Social Media Kit", "Business Cards"],
    popular: false,
    category: "Design"
  }
];

export default function Pricing() {
  const whatsappNumber = "6281913715220"; // Replace with user's number

  return (
    <section id="pricing" className="py-20 bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Pricing Packages</h2>
          <p className="text-gray-400">Transparent pricing for quality work.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl border ${pkg.popular ? 'border-primary bg-primary/5' : 'border-white/10 bg-white/5'} backdrop-blur-sm flex flex-col`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
                  <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">{pkg.category}</span>
                <h3 className="text-2xl font-bold text-white mt-2 mb-4">{pkg.name}</h3>
                <div className="flex flex-col">
                   <p className="text-gray-400 text-sm mb-1">{pkg.priceLabel}</p>
                   <p className="text-3xl font-bold text-primary">{pkg.price}</p>
                </div>
              </div>

              <ul className="mb-8 space-y-4 flex-1">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={`https://wa.me/${whatsappNumber}?text=Halo, saya tertarik dengan paket ${pkg.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  pkg.popular 
                    ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25' 
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                Order via WhatsApp
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
