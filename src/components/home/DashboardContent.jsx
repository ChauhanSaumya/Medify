import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, ClipboardCopy, RefreshCw, UserCircle } from 'lucide-react';
import HealthForm from '@/components/HealthForm';
import HealthCard from '@/components/HealthCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardContent = ({ 
  session, formData, setFormData, handleFormSubmit, handleReset, isSaving, loadingData, 
  qrCodeUrl, publicCardLink, copyToClipboard, isLoaded, showDemoDataInCard, isCardDataSaved
}) => {
  if (loadingData && session) {
    return (
      <div className="flex items-center justify-center p-10 bg-white rounded-lg shadow-md min-h-[300px]">
        <RefreshCw className="animate-spin h-8 w-8 text-green-500 mr-3" />
        <p className="text-lg text-gray-600">Loading your card details...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 p-6 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-green-700 mb-2 flex items-center">
          <UserCircle className="w-8 h-8 mr-3 text-green-600" />
          Your Health Dashboard
        </h1>
        <p className="text-green-600">
          Welcome, {session?.user?.email}! Manage your health card details below. 
          Your changes will be reflected on your public QR card instantly.
        </p>
      </div>
      
      {publicCardLink && (
        <Card className="mb-8 shadow-lg border-gray-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-gray-700"><QrCode className="w-6 h-6 text-green-500"/>Your Public Card Link</CardTitle>
                <CardDescription>This is the unique link to your shareable health card. Anyone with this link can view your card.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <Input 
                    type="text" 
                    value={publicCardLink} 
                    readOnly 
                    className="flex-grow bg-gray-100 text-sm"
                />
                <Button onClick={() => copyToClipboard(publicCardLink)} variant="outline" className="w-full sm:w-auto">
                    <ClipboardCopy className="w-4 h-4 mr-2"/> Copy Link
                </Button>
            </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-3">
          <HealthForm 
            formData={formData} 
            setFormData={setFormData}
            onReset={handleReset}
            onSubmit={handleFormSubmit}
            isSaving={isSaving}
            disabled={!session}
          />
        </div>

        <div className="lg:col-span-2 lg:sticky lg:top-28">
          <motion.div 
              className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
          >
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Live Card Preview</h2>
              <p className="text-gray-600 text-sm mb-6 text-center">Your card updates as you type. This is how it appears publicly.</p>
              <HealthCard 
                formData={formData} 
                isLoaded={isLoaded} 
                showDemoData={showDemoDataInCard} 
                qrCodeCustomUrl={qrCodeUrl} 
                isDashboardPreview={true}
                isCardDataSaved={isCardDataSaved}
                session={session}
              />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DashboardContent;