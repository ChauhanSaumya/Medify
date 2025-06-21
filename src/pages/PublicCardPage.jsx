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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 p-4 pt-20 text-center">
        <Loader2 className="h-16 w-16 text-green-500 animate-spin mb-6" />
        <h1 className="text-2xl font-semibold text-gray-700 mb-2">Fetching Health Card...</h1>
        <p className="text-gray-500">Please wait a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 p-4 pt-20 text-center">
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
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-teal-50 to-emerald-100 p-4 sm:p-8 pt-24"
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
        <p className="text-sm text-gray-600 text-center mb-8">
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
            <h2 className="text-lg font-semibold text-green-700 mb-2">Medications</h2>
            <p className="text-gray-700">{healthData.current_medications || 'None'}</p>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold text-green-700 mb-2">Additional Notes</h2>
            <p className="text-gray-700">{healthData.additional_notes || 'None'}</p>
          </div>

          {healthData.health_report_links && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold text-green-700 mb-2">Health Reports</h2>
              <a href={healthData.health_report_links} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                View Reports
              </a>
            </div>
          )}

          {healthData.medical_document_urls && healthData.medical_document_urls.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold text-green-700 mb-2">Uploaded Medical Documents</h2>
              <ul className="space-y-2">
                {healthData.medical_document_urls.map((docUrl, index) => (
                  <li key={index}>
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      📄 View Document {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" /> Go Back to Medify Home
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PublicCardPage;
