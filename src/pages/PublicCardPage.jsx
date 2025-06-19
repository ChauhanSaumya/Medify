import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import HealthCard from '@/components/HealthCard';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Loader2, ArrowLeft, Download } from 'lucide-react';
import MedifyLogo from '@/components/MedifyLogo';
import { Button } from '@/components/ui/button';

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
  
  const formattedHealthData = healthData ? {
    name: healthData.name,
    age: healthData.age,
    bloodGroup: healthData.blood_group,
    emergencyContact: healthData.emergency_contact,
    allergies: healthData.allergies,
    medicalConditions: healthData.medical_conditions,
    medications: healthData.medications,
    additionalNotes: healthData.additional_notes,
    healthReportLinks: healthData.health_report_links,
    profilePicture: healthData.profile_picture_url,
  } : {};

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
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-6">
            <MedifyLogo width="w-10" height="h-10" />
        </div>
        <motion.div
          initial={{ opacity: 0, y:20 }}
          animate={{ opacity: 1, y:0 }}
          transition={{ delay:0.2, duration:0.5 }}
        >
          <HealthCard 
            formData={formattedHealthData} 
            isLoaded={true} 
            showDemoData={false} 
            isPublicView={true}
            qrCodeCustomUrl={healthData.qr_code_url}
          />
        </motion.div>
        <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green-600" /> 
                This is a secure, read-only view of a Medify health card.
            </p>
            <Button asChild variant="link" className="mt-2 text-green-600 hover:text-green-500">
                <Link to="/">
                    Learn more about Medify
                </Link>
            </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PublicCardPage;