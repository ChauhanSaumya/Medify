
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Download, User, Phone, ShieldCheck, Info, FileText } from 'lucide-react';
import QRCode from 'qrcode';
import { useToast } from '@/components/ui/use-toast';

const demoData = {
  name: 'Jane Doe',
  age: '34',
  bloodGroup: 'O+',
  emergencyContact: '123-456-7890',
  allergies: 'Penicillin, Nuts',
  medicalConditions: 'Type 1 Diabetes, Asthma',
  medications: 'Insulin - 10 units daily, Albuterol Inhaler - as needed',
  additionalNotes: 'Wears contact lenses.',
  healthReportLinks: '',
  profilePicture: null,
  medicalDocumentUrls: [],
};

const HealthCard = ({ 
  formData, 
  isLoaded, 
  showDemoData, 
  qrCodeCustomUrl, 
  isGuestMode = false, 
  isPublicView = false, 
  isDashboardPreview = false,
  isCardDataSaved = false, 
  session 
}) => {
  const { toast } = useToast();
  const qrCanvasRef = useRef(null);
  const [displayData, setDisplayData] = useState(demoData);
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  useEffect(() => {
    if (isLoaded) {
      if (showDemoData && !isPublicView) {
        setDisplayData(demoData);
        setProfilePicUrl(null);
      } else {
        setDisplayData(formData);
        if (formData.profilePicture && typeof formData.profilePicture === 'string') {
          setProfilePicUrl(formData.profilePicture);
        } else {
          setProfilePicUrl(null); 
        }
      }
    }
  }, [formData, isLoaded, showDemoData, isPublicView]);

  const generateQRDataString = () => {
    const dataToEncode = (showDemoData && !isPublicView && !isDashboardPreview) ? demoData : displayData;
    
    const qrData = {
      name: dataToEncode.name,
      age: dataToEncode.age,
      bloodGroup: dataToEncode.bloodGroup || dataToEncode.blood_group, 
      allergies: dataToEncode.allergies,
      medicalConditions: dataToEncode.medicalConditions || dataToEncode.medical_conditions,
      medications: dataToEncode.medications,
      emergencyContact: dataToEncode.emergencyContact || dataToEncode.emergency_contact,
      additionalNotes: dataToEncode.additionalNotes || dataToEncode.additional_notes,
      healthReportLinks: dataToEncode.healthReportLinks || dataToEncode.health_report_links,
      medicalDocumentUrls: dataToEncode.medicalDocumentUrls || [],
      generatedAt: new Date().toISOString()
    };
    return JSON.stringify(qrData, null, 2);
  };

  useEffect(() => {
    if (qrCanvasRef.current) {
      const finalQrUrl = qrCodeCustomUrl ? `${window.location.origin}${qrCodeCustomUrl}` : generateQRDataString();
      QRCode.toCanvas(qrCanvasRef.current, finalQrUrl, {
        width: 120,
        margin: 1,
        color: {
          dark: '#107C41', 
          light: '#FFFFFF00' 
        }
      }).catch(err => {
        console.error('QR Code generation error:', err);
        toast({
          title: "QR Error",
          description: "Could not generate QR code.",
          variant: "destructive"
        });
      });
    }
  }, [displayData, toast, qrCodeCustomUrl, showDemoData, formData]);


  const downloadButtonDisabled = () => {
    if (isGuestMode) return true;
    if (!session) { 
      return (showDemoData || !formData || !formData.name);
    }
    return !isCardDataSaved;
  };
  
  const getDownloadDisabledTitle = () => {
    if (isGuestMode) return "Login to enable download";
    if (!session) {
      if (showDemoData || !formData || !formData.name) return "Fill in your details to enable download";
    }
    if (session && !isCardDataSaved) return "Save your card details first";
    return "Download Printable Card";
  };


  const downloadCard = () => {
    if (downloadButtonDisabled()) {
      toast({
        title: "⚠️ Action Required",
        description: getDownloadDisabledTitle(),
        variant: "default"
      });
      return;
    }
    
    const qrCanvasElement = qrCanvasRef.current;
    if (qrCanvasElement) {
        const scaleFactor = 3; 
        const cardWidth = 337 * scaleFactor; 
        const cardHeight = 212 * scaleFactor; 
        const printableCanvas = document.createElement('canvas');
        printableCanvas.width = cardWidth;
        printableCanvas.height = cardHeight;
        const ctx = printableCanvas.getContext('2d');

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, cardWidth, cardHeight);

        const gradient = ctx.createLinearGradient(0,0, cardWidth, cardHeight);
        gradient.addColorStop(0, '#E0F2F1'); 
        gradient.addColorStop(1, '#E8F5E9'); 
        ctx.fillStyle = gradient;
        ctx.fillRect(0,0, cardWidth, cardHeight);
        
        ctx.strokeStyle = '#B2DFDB'; 
        ctx.lineWidth = 2 * scaleFactor;
        ctx.strokeRect(1 * scaleFactor, 1 * scaleFactor, cardWidth - (2 * scaleFactor), cardHeight - (2 * scaleFactor));
        
        ctx.font = `bold ${10 * scaleFactor}px Inter, sans-serif`;
        ctx.fillStyle = "#004D40"; 
        ctx.fillText("Medify", 15 * scaleFactor, 25 * scaleFactor);
        ctx.font = `${8 * scaleFactor}px Inter, sans-serif`;
        ctx.fillStyle = "#00796B"; 
        ctx.fillText("Essential Health Card", 15 * scaleFactor, 35 * scaleFactor);

        ctx.font = `bold ${18 * scaleFactor}px Inter, sans-serif`;
        ctx.fillStyle = "#D32F2F"; 
        ctx.textAlign = "right";
        ctx.fillText(displayData.bloodGroup || displayData.blood_group || '--', cardWidth - (15 * scaleFactor), 30 * scaleFactor);
        ctx.font = `${8 * scaleFactor}px Inter, sans-serif`;
        ctx.fillStyle = "#757575"; 
        ctx.fillText("Blood Type", cardWidth - (15 * scaleFactor), 40 * scaleFactor);
        ctx.textAlign = "left";

        const drawCardContentOnDownload = () => {
            ctx.font = `bold ${14 * scaleFactor}px Inter, sans-serif`;
            ctx.fillStyle = "#212121"; 
            ctx.fillText(displayData.name || 'Your Name', 75 * scaleFactor, 70 * scaleFactor);
            ctx.font = `${10 * scaleFactor}px Inter, sans-serif`;
            ctx.fillStyle = "#424242"; 
            ctx.fillText(displayData.age ? `${displayData.age} Years` : 'Your Age', 75 * scaleFactor, 85 * scaleFactor);

            ctx.font = `bold ${10 * scaleFactor}px Inter, sans-serif`;
            ctx.fillStyle = "#D32F2F"; 
            ctx.fillText("Emergency Contact:", 15 * scaleFactor, 125 * scaleFactor);
            ctx.font = `${10 * scaleFactor}px Inter, sans-serif`;
            ctx.fillStyle = "#212121";
            ctx.fillText(displayData.emergencyContact || displayData.emergency_contact || 'Contact No.', 15 * scaleFactor, 140 * scaleFactor);
            
            const finalQrUrlForDownload = qrCodeCustomUrl ? `${window.location.origin}${qrCodeCustomUrl}` : generateQRDataString();
            QRCode.toDataURL(finalQrUrlForDownload, { width: 70 * scaleFactor, margin: 1, color: { dark: '#107C41', light: '#FFFFFF00' } })
            .then(url => {
                const qrImage = new Image();
                qrImage.onload = () => {
                    ctx.drawImage(qrImage, cardWidth - (15 * scaleFactor) - (70 * scaleFactor), cardHeight - (15 * scaleFactor) - (70 * scaleFactor) - (10 * scaleFactor), 70 * scaleFactor, 70 * scaleFactor);
                    
                    ctx.font = `${7 * scaleFactor}px Inter, sans-serif`;
                    ctx.fillStyle = "#757575"; 
                    ctx.textAlign = "center";
                    const qrNote = qrCodeCustomUrl ? "Scan for online profile" : "Scan QR for full medical profile";
                    ctx.fillText(qrNote, cardWidth / 2, cardHeight - (20 * scaleFactor));
                    
                    ctx.font = `${6 * scaleFactor}px Inter, sans-serif`;
                    ctx.fillStyle = "#00796B";
                    ctx.fillText("Details can be updated by revisiting the site.", cardWidth / 2, cardHeight - (10 * scaleFactor));

                    const link = document.createElement('a');
                    link.download = `${(displayData.name || "Medify").replace(/\s+/g, '_')}_Medify_Card.png`;
                    link.href = printableCanvas.toDataURL('image/png');
                    link.click();
                    
                    toast({
                      title: "✅ Card Downloaded!",
                      description: "Your health card image has been saved.",
                    });
                }
                qrImage.onerror = () => console.error("Error loading QR image for download canvas");
                qrImage.src = url;
            })
            .catch(err => {
                console.error('Error generating QR for download:', err);
                toast({ title: "QR Error", description: "Could not generate QR for download.", variant: "destructive" });
            });
        };
        
        const drawDefaultAvatarOnDownload = () => {
          ctx.fillStyle = '#E0E0E0'; 
          ctx.beginPath();
          ctx.arc(40 * scaleFactor, 75 * scaleFactor, 25 * scaleFactor, 0, Math.PI * 2, true);
          ctx.fill();
          ctx.fillStyle = '#A0A0A0'; 
          
          const userIconUnicode = "\u{1F464}"; 
          
          ctx.font = `${20 * scaleFactor}px sans-serif`; 
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(userIconUnicode, 40 * scaleFactor, 75 * scaleFactor); 
          ctx.textAlign = "left";
          ctx.textBaseline = "alphabetic";
        };

        if (profilePicUrl) {
          const img = new Image();
          img.crossOrigin = "anonymous"; 
          img.onload = () => {
            ctx.save();
            ctx.beginPath();
            ctx.arc(40 * scaleFactor, 75 * scaleFactor, 25 * scaleFactor, 0, Math.PI * 2, true); 
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(img, 15 * scaleFactor, 50 * scaleFactor, 50 * scaleFactor, 50 * scaleFactor);
            ctx.restore();
            drawCardContentOnDownload();
          }
          img.onerror = () => {
            drawDefaultAvatarOnDownload();
            drawCardContentOnDownload();
          }
          img.src = profilePicUrl;
        } else {
          drawDefaultAvatarOnDownload();
          drawCardContentOnDownload();
        }
    } else {
       toast({
          title: "Error Downloading Card",
          description: "QR code canvas not found.",
          variant: "destructive"
        });
    }
  };


  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {showDemoData && isLoaded && !isPublicView && (
         <div className="flex items-center justify-center gap-2 mb-3">
           <div className="relative inline-flex items-center gap-2 text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
             <span className="relative flex h-2.5 w-2.5">
              <span className="live-indicator absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
             Showing Demo Data
           </div>
         </div>
      )}

      <Card className="health-card card-shadow overflow-hidden max-w-sm mx-auto w-full rounded-xl border-2 border-green-200/50">
        <CardContent className="p-4 sm:p-5 flex flex-col h-full">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 text-green-600">
                  <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-gray-800">Medify</span>
            </div>
            <div className="text-right">
              <p className="font-extrabold text-lg sm:text-xl text-red-600">{displayData.bloodGroup || displayData.blood_group || '--'}</p>
              <p className="text-xs text-gray-500 -mt-1">Blood Type</p>
            </div>
          </div>

          <div className="flex-grow grid grid-cols-3 gap-3 sm:gap-4">
            <div className="col-span-1 flex flex-col items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-inner overflow-hidden">
                {profilePicUrl ? (
                  <img src={profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
                )}
              </div>
            </div>
            <div className="col-span-2 space-y-1 sm:space-y-1.5 flex flex-col justify-center">
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-bold text-base sm:text-lg leading-tight text-gray-800">{displayData.name || 'Your Name'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Age</p>
                <p className="font-semibold text-sm sm:text-base text-gray-700">{displayData.age ? `${displayData.age} Years` : 'Your Age'}</p>
              </div>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-dashed border-gray-300/70">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500">Emergency Contact</p>
                    <p className="font-semibold text-sm sm:text-base text-red-600 flex items-center gap-1">
                      <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {displayData.emergencyContact || displayData.emergency_contact || 'Contact No.'}
                    </p>
                  </div>
                  <div className="p-0.5 bg-white/30 rounded-md border border-gray-200/80 shadow-sm">
                    <canvas ref={qrCanvasRef} className="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px]"/>
                  </div>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-1">
                {qrCodeCustomUrl ? "Scan for online profile" : "Scan QR for full medical profile"}
              </p>
            </div>
          </div>
          
          {isPublicView && displayData.medicalDocumentUrls && displayData.medicalDocumentUrls.length > 0 && (
            <div className="mt-3 pt-3 border-t border-dashed border-gray-300/70">
              <p className="text-xs text-gray-500 mb-1">Medical Documents:</p>
              <div className="space-y-1">
                {displayData.medicalDocumentUrls.map((doc, index) => (
                  <a 
                    key={index} 
                    href={doc.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center text-xs text-blue-600 hover:underline"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    {doc.name || `Document ${index + 1}`}
                  </a>
                ))}
              </div>
            </div>
          )}

        </CardContent>
      </Card>
      {!isGuestMode && (
         <motion.div 
            className="mt-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          >
            <Button 
                onClick={downloadCard}
                className="w-full creative-gradient text-white hover:opacity-90 transition-opacity text-base py-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                size="lg"
                disabled={downloadButtonDisabled()}
                title={getDownloadDisabledTitle()}
            >
                <Download className="h-5 w-5 mr-2.5" />
                Download Printable Card
            </Button>
         </motion.div>
        )}
        {isDashboardPreview && !isGuestMode && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-xs text-green-700 flex items-center justify-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Details can be updated by revisiting this site. Your QR code remains the same.
            </p>
          </div>
        )}
    </motion.div>
  );
};

export default HealthCard;
