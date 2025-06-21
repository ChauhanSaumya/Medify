import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCopy } from 'lucide-react';
import FAQ from '@/components/FAQ';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

import AuthOverlay from '@/components/home/AuthOverlay';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import HowToUseSection from '@/components/home/HowToUseSection';
import DashboardContent from '@/components/home/DashboardContent';

const initialFormState = {
  name: '', 
  age: '', 
  bloodGroup: '', 
  allergies: '', 
  medicalConditions: '',
  medications: '', 
  emergencyContact: '', 
  additionalNotes: '', 
  healthReportLinks: [''], // Changed to array with one empty string
  profilePicture: null,
};

const base64ToBlob = (base64, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

const HomePage = ({ session }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(initialFormState);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDemoDataInCard, setShowDemoDataInCard] = useState(true);
  const [publicCardLink, setPublicCardLink] = useState('');
  const [isCardDataSaved, setIsCardDataSaved] = useState(false);

  const fetchUserHealthCard = useCallback(async () => {
    if (!session?.user?.id) {
      setFormData(initialFormState);
      setShowDemoDataInCard(true);
      setQrCodeUrl('');
      setPublicCardLink('');
      setLoadingData(false);
      setIsLoaded(true);
      setIsCardDataSaved(false); 
      return;
    }

    setLoadingData(true);
    setIsCardDataSaved(false); 

    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.user) {
        throw userError || new Error("User not found");
      }

      const { data, error } = await supabase
        .from('health_cards')
        .select('*')
        .eq('user_id', user.user.id)
        .single();

      if (error && error.code !== 'PGRST116') { 
        console.error("Error fetching health card data:", error);
        throw error;
      }
      
      if (data) {
        // Parse health_report_links - handle both string and array formats
        let healthReportLinksArray = [''];
        if (data.health_report_links) {
          if (Array.isArray(data.health_report_links)) {
            healthReportLinksArray = data.health_report_links.length > 0 ? data.health_report_links : [''];
          } else if (typeof data.health_report_links === 'string') {
            // Convert old single string format to array
            const trimmed = data.health_report_links.trim();
            healthReportLinksArray = trimmed ? [trimmed] : [''];
          }
        }

        const fetchedData = {
          name: data.name || '',
          age: data.age || '',
          bloodGroup: data.blood_group || '',
          allergies: data.allergies || '',
          medicalConditions: data.medical_conditions || '',
          medications: data.medications || '',
          emergencyContact: data.emergency_contact || '',
          additionalNotes: data.additional_notes || '',
          healthReportLinks: healthReportLinksArray,
          profilePicture: data.profile_picture_url || null,
        };
        setFormData(fetchedData);
        const cardPath = data.qr_code_url || `/card/${user.user.id}`;
        setQrCodeUrl(cardPath);
        setPublicCardLink(`${window.location.origin}${cardPath}`);
        setShowDemoDataInCard(false);
        setIsCardDataSaved(true); 
      } else {
         setFormData({...initialFormState});
         const cardPath = `/card/${user.user.id}`;
         setQrCodeUrl(cardPath);
         setPublicCardLink(`${window.location.origin}${cardPath}`);
         setShowDemoDataInCard(true);
         setIsCardDataSaved(false);
      }
    } catch (error) {
      toast({
        title: 'Error Fetching Data',
        description: error.message || 'Could not load your health card information.',
        variant: 'destructive',
      });
      setFormData({...initialFormState}); 
      setShowDemoDataInCard(true);
      setIsCardDataSaved(false);
    } finally {
      setLoadingData(false);
      setIsLoaded(true);
    }
  }, [session?.user?.id, toast]);

  useEffect(() => {
    if (session) {
      fetchUserHealthCard();
    } else {
      setFormData(initialFormState);
      setShowDemoDataInCard(true);
      setQrCodeUrl('');
      setPublicCardLink('');
      setLoadingData(false);
      setIsLoaded(true);
      setIsCardDataSaved(false);
    }
  }, [session, fetchUserHealthCard]);

  const handleSupabaseSubmit = async (currentFormDataFromForm) => {
    if (!session?.user) {
      toast({ title: 'Login Required', description: 'Please login to save your health card.', variant: 'default' });
      return;
    }
    setIsSaving(true);
    
    let profilePictureUrlToSave = currentFormDataFromForm.profilePicture; 
    
    if (currentFormDataFromForm.profilePicture && typeof currentFormDataFromForm.profilePicture === 'string' && currentFormDataFromForm.profilePicture.startsWith('data:image')) {
      try {
        const imageBase64 = currentFormDataFromForm.profilePicture;
        const contentType = imageBase64.substring(imageBase64.indexOf(':') + 1, imageBase64.indexOf(';'));
        const blob = base64ToBlob(imageBase64, contentType);
        
        const fileExtension = contentType.split('/')[1] || 'png';
        const fileName = `profile-${session.user.id}-${Date.now()}.${fileExtension}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(fileName, blob, { 
            upsert: true, 
            contentType: blob.type 
          });

        if (uploadError) {
          console.error('Supabase storage upload error:', uploadError);
          throw uploadError;
        }
        
        const { data: urlData } = supabase.storage.from('profile-pictures').getPublicUrl(uploadData.path);
        profilePictureUrlToSave = urlData.publicUrl;

      } catch (error) {
        console.error("Profile picture processing/upload error:", error);
        toast({ title: 'Profile Picture Error', description: error.message || 'Failed to process or upload profile picture.', variant: 'destructive' });
        setIsSaving(false); 
        return;
      }
    } else if (currentFormDataFromForm.profilePicture === null && formData.profilePicture !== null) {
       profilePictureUrlToSave = null;
    }

    // Filter out empty health report links
    const filteredHealthReportLinks = currentFormDataFromForm.healthReportLinks
      .filter(link => link && link.trim() !== '');

    const currentCardPath = qrCodeUrl || `/card/${session.user.id}`;
    const healthCardData = {
      user_id: session.user.id,
      name: currentFormDataFromForm.name,
      age: currentFormDataFromForm.age,
      blood_group: currentFormDataFromForm.bloodGroup,
      allergies: currentFormDataFromForm.allergies,
      medical_conditions: currentFormDataFromForm.medicalConditions,
      medications: currentFormDataFromForm.medications,
      emergency_contact: currentFormDataFromForm.emergencyContact,
      additional_notes: currentFormDataFromForm.additionalNotes,
      health_report_links: filteredHealthReportLinks.length > 0 ? filteredHealthReportLinks : null,
      profile_picture_url: profilePictureUrlToSave,
      qr_code_url: currentCardPath,
    };

    try {
      const { error } = await supabase.from('health_cards').upsert(healthCardData, { onConflict: 'user_id' });
      if (error) throw error;

      setFormData(prev => ({
        ...prev, 
        ...currentFormDataFromForm, 
        profilePicture: profilePictureUrlToSave,
      }));
      setShowDemoDataInCard(false); 
      setIsCardDataSaved(true);
      toast({ title: '💾 Data Saved Successfully!', description: 'Your health card information has been updated.' });
    } catch (error) {
      console.error("Error saving data:", error);
      toast({ title: 'Error Saving Data', description: error.message || 'Could not save your health card information.', variant: 'destructive' });
      setIsCardDataSaved(false); 
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleReset = async () => {
    const newInitialState = {...initialFormState};
    setFormData(newInitialState);
    setShowDemoDataInCard(true); 
    setIsCardDataSaved(false);
    
    if (session?.user) {
      setIsSaving(true);
      try {
        const dataToUpdate = { 
          name: null, 
          age: null, 
          blood_group: null, 
          allergies: null, 
          medical_conditions: null,
          medications: null, 
          emergency_contact: null, 
          additional_notes: null, 
          health_report_links: null,
          profile_picture_url: null,
        };

        const { error } = await supabase
          .from('health_cards')
          .update(dataToUpdate) 
          .eq('user_id', session.user.id);
        if (error) {
          throw error;
        }
        toast({ title: "🔄 Form Reset", description: "Your card data has been cleared from the server." });
      } catch (error) {
        toast({ title: "Error Resetting Data", description: error.message, variant: "destructive" });
      } finally {
        setIsSaving(false);
      }
    }
    const profilePicInput = document.getElementById('profilePicture');
    if (profilePicInput) profilePicInput.value = '';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: 'Copied to Clipboard!', icon: <ClipboardCopy className="w-4 h-4" /> });
    }).catch(err => {
      toast({ title: 'Failed to Copy', description: err.message, variant: 'destructive' });
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <AnimatePresence>
        {!session && <AuthOverlay navigate={navigate} />}
      </AnimatePresence>
      
      <div className={`${!session ? 'blur-sm pointer-events-none' : ''} transition-all duration-300`}>
        <HeroSection />
        <FeaturesSection />
        
        <motion.section 
          id="dashboard-section" 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <DashboardContent
            session={session}
            formData={formData}
            setFormData={setFormData}
            handleFormSubmit={handleSupabaseSubmit}
            handleReset={handleReset}
            isSaving={isSaving}
            loadingData={loadingData}
            qrCodeUrl={qrCodeUrl}
            publicCardLink={publicCardLink}
            copyToClipboard={copyToClipboard}
            isLoaded={isLoaded}
            showDemoDataInCard={showDemoDataInCard}
            isCardDataSaved={isCardDataSaved}
          />
        </motion.section>

        <HowToUseSection />
        <FAQ />
      </div>
    </motion.div>
  );
};

export default HomePage;
