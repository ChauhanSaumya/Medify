import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, CheckCircle, XCircle } from 'lucide-react';

const faqData = [
  {
    question: "What is Medify?",
    answer: "Medify is an emergency health card generator that creates a personalized health card linked to a static QR code. When scanned, the QR code provides life-saving medical information instantly."
  },
  {
    question: "How does Medify work?",
    answer: (
      <ul className="list-disc space-y-1 pl-5">
        <li>Users log in using their Google account (or email/password).</li>
        <li>First-time users fill in their medical and personal details.</li>
        <li>Medify generates a printable health card with a static QR code.</li>
        <li>Users can update their details anytime by revisiting the website.</li>
        <li>The QR code always remains the same.</li>
      </ul>
    )
  },
  {
    question: "Can I update my health details after creating the card?",
    answer: (
      <div className="space-y-1">
        <p className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Yes, you can update your information anytime by logging in again with the same account.</p>
        <p className="flex items-center"><XCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" /> The QR code does not change after updates.</p>
      </div>
    )
  },
  {
    question: "Is my data secure?",
    answer: "Yes. Medify uses secure authentication and privacy-focused storage via Supabase. Your data is accessible in read-only format when scanned, and only you can edit it after logging in."
  },
  {
    question: "Do I need to create a new card if I update my information?",
    answer: "No. You can continue using your existing printed card because the QR code remains unchanged. When scanned, the most recent updated information will automatically appear."
  },
  {
    question: "How much does it cost?",
    answer: (
      <p className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Medify is absolutely free for all users. You can generate, download, and update your emergency health card at no cost.</p>
    )
  },
  {
    question: "What happens if I lose my printed card?",
    answer: "You can simply log in again and reprint your health card. The QR code linked to your account will remain the same."
  },
  {
    question: "Who can access my information?",
    answer: "Only those who scan your QR code can view your emergency health details. They will have read-only access – no one can modify your information except you."
  },
  {
    question: "Do I need to install any app?",
    answer: "No. Medify is a web-based platform. You only need internet access to create or update your card. Your QR code works to display info when scanned (if the scanner has internet)."
  },
  {
    question: "Can I use Medify for family members?",
    answer: "Currently, one card is linked to one account. For family members, you would need separate logins/accounts."
  }
];

const FAQ = () => {
  return (
    <motion.section 
      id="faq" 
      className="py-16 sm:py-24 bg-slate-50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <HelpCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Have questions? We've got answers. If you have other questions, feel free to reach out.
          </p>
        </div>
        
        <Card className="card-shadow bg-white rounded-xl shadow-lg border border-gray-200/50">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="border-b border-gray-200 last:border-b-0">
                  <AccordionTrigger className="text-left text-base font-semibold py-4 hover:no-underline group">
                    <span className="group-hover:text-green-600 transition-colors">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm pb-4 leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
};

export default FAQ;