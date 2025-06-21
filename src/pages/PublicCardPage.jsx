import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MedifyLogo from '@/components/MedifyLogo';

const PublicCardPage = () => {
  const { userId } = useParams();
  const { toast } = useToast();
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPublicHealthCard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from('health_cards')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (dbError && dbError.code !== 'PGRST116') {
        throw dbError;
      }
      if (!data) {
        throw new Error("Health card not found or user hasn't set it up yet.");
      }
      setHealthData(data);
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Error Loading Card',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    fetchPublicHealthCard();
  }, [fetchPublicHealthCard]);

  // Helper function to parse health report links
  const parseHealthReportLinks = (linksString) => {
    if (!linksString || typeof linksString !== 'string') return [];
    
    return linksString
      .split('\n') // Split by newlines
      .map(link => link.trim()) // Remove whitespace
      .filter(link => link.length > 0) // Remove empty lines
      .filter(link => {
        // Basic URL validation
        try {
          new URL(link);
          return true;
        } catch {
          return link.startsWith('http://') || link.startsWith('https://');
        }
      });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 p-4 text-center z-50">
        <Loader2 className="h-16 w-16 text-green-500 animate-spin mb-6" />
        <h1 className="text-2xl font-semibold text-gray-700 mb-2">Fetching Health Card...</h1>
        <p className="text-gray-500">Please wait a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 p-4 text-center z-50">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-6" />
        <h1 className="text-2xl font-semibold text-red-700 mb-2">Oops! Card Not Found</h1>
        <p className="text-red-600 max-w-md mb-8">
          {error === "Health card not found or user hasn't set it up yet."
            ? "This health card might not exist or hasn't been fully set up by the user. Please check the link or QR code."
            : "We couldn't load the health card due to an error."}
        </p>
        <Button asChild variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back to Medify Home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-auto z-50">
      <motion.div
        className="min-h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-teal-50 to-emerald-100 p-4 sm:p-8 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-center mb-6">
            <MedifyLogo width="w-10" height="h-10" />
          </div>

          <h1 className="text-2xl font-bold text-green-700 mb-4 text-center">Emergency Medical Information</h1>
          <p className="text-sm text-gray-600 text-center mb-8 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            This is a secure, read-only view of a Medify health card.
          </p>

          <div className="space-y-4">
            <div className="flex justify-center">
              {healthData.profile_picture_url ? (
                <img
                  src={healthData.profile_picture_url}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-green-300"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-200 text-gray-500">
                  No Image
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <div><strong>Name:</strong> {healthData.name}</div>
              <div><strong>Age:</strong> {healthData.age}</div>
              <div><strong>Blood Group:</strong> {healthData.blood_group}</div>
              <div><strong>Emergency Contact:</strong> {healthData.emergency_contact}</div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-green-700 mb-2">Allergies</h2>
              <p className="text-gray-700">{healthData.allergies || 'None'}</p>
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-semibold text-green-700 mb-2">Medical Conditions</h2>
              <p className="text-gray-700">{healthData.medical_conditions || 'None'}</p>
            </div>
            
            <div className="mt-4">
              <h2 className="text-lg font-semibold text-green-700 mb-2">Current Medications</h2>
              <p className="text-gray-700">{healthData.medications || 'None'}</p>
            </div>
    
            {/* Health Reports - Handle multiple links */}
            <div className="mt-4">
              <h2 className="text-lg font-semibold text-green-700 mb-2">Health Reports</h2>
              {(() => {
                const healthReportLinks = parseHealthReportLinks(healthData.health_report_links);
                if (healthReportLinks.length > 0) {
                  return (
                    <div className="space-y-2">
                      {healthReportLinks.map((link, index) => (
                        <div key={index}>
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800 transition-colors block"
                          >
                            📄 Health Report {healthReportLinks.length > 1 ? `#${index + 1}` : ''}
                          </a>
                        </div>
                      ))}
                    </div>
                  );
                } else {
                  return <span className="text-gray-500">No Reports Uploaded</span>;
                }
              })()}
            </div>
              
            <div className="mt-4">
              <h2 className="text-lg font-semibold text-green-700 mb-2">Additional Notes</h2>
              <p className="text-gray-700">{healthData.additional_notes || 'None'}</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button asChild variant="link" className="text-green-600 hover:text-green-500">
              <Link to="/">
                Learn more about Medify
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PublicCardPage;
