
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Edit3, User, Phone, Droplets, Heart, Activity, Info, RotateCcw, ChevronDown, UploadCloud, Image as ImageIcon, Save, Loader2, Link as LinkIcon, FileText, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const HealthForm = ({ formData: initialFormData, setFormData: setParentFormData, onReset, onSubmit, isSaving, disabled, session }) => {
  const { toast } = useToast();
  const [localFormData, setLocalFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [openSections, setOpenSections] = useState({ essential: true, medical: true }); 
  const profilePicInputRef = useRef(null);
  const medicalDocsInputRef = useRef(null);
  const [profilePicFileName, setProfilePicFileName] = useState('');
  const [medicalDocFiles, setMedicalDocFiles] = useState([]); 

  useEffect(() => {
    setLocalFormData(initialFormData);
    if(initialFormData.profilePicture && typeof initialFormData.profilePicture === 'string' && !initialFormData.profilePicture.startsWith('data:image')) {
      setProfilePicFileName('Profile image loaded'); 
    } else if (!initialFormData.profilePicture) {
      setProfilePicFileName('');
    }
    
    if (initialFormData.medicalDocumentUrls && Array.isArray(initialFormData.medicalDocumentUrls)) {
      setMedicalDocFiles(initialFormData.medicalDocumentUrls.map(doc => ({ name: doc.name || 'Uploaded Document', url: doc.url, isExisting: true })));
    } else {
      setMedicalDocFiles([]);
    }

  }, [initialFormData]);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const validateForm = () => {
    const newErrors = {};
    if (!localFormData.name?.trim()) newErrors.name = 'Full name is required.';
    if (!localFormData.age || localFormData.age < 1 || localFormData.age > 150) newErrors.age = 'Please enter a valid age (1-150).';
    if (!localFormData.bloodGroup) newErrors.bloodGroup = 'Blood group is required.';
    if (!localFormData.emergencyContact?.trim()) newErrors.emergencyContact = 'Emergency contact number is required.';
    else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(localFormData.emergencyContact)) {
      newErrors.emergencyContact = 'Please enter a valid phone number.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    const updatedFormData = { ...localFormData, [field]: value };
    setLocalFormData(updatedFormData);
    setParentFormData(updatedFormData); 
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        toast({ title: "❌ File Too Large", description: "Profile picture must be less than 2MB.", variant: "destructive" });
        setProfilePicFileName(''); handleInputChange('profilePicture', null); if(profilePicInputRef.current) profilePicInputRef.current.value = ""; return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast({ title: "❌ Invalid File Type", description: "Please upload a JPG, PNG, or WEBP image.", variant: "destructive" });
        setProfilePicFileName(''); handleInputChange('profilePicture', null); if(profilePicInputRef.current) profilePicInputRef.current.value = ""; return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('profilePicture', reader.result); setProfilePicFileName(file.name);
        toast({ title: "🖼️ Picture Selected", description: `${file.name} ready. Save to upload.` });
      };
      reader.readAsDataURL(file);
    } else {
      handleInputChange('profilePicture', null); setProfilePicFileName('');
    }
  };

  const handleMedicalDocsChange = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = [];
    let hasError = false;

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit per PDF
        toast({ title: "❌ File Too Large", description: `${file.name} is over 5MB. Please upload smaller PDFs.`, variant: "destructive" });
        hasError = true; return;
      }
      if (file.type !== 'application/pdf') {
        toast({ title: "❌ Invalid File Type", description: `${file.name} is not a PDF. Please upload PDF files only.`, variant: "destructive" });
        hasError = true; return;
      }
      newFiles.push({ file, name: file.name, isNew: true });
    });

    if (!hasError && newFiles.length > 0) {
      const updatedMedicalDocFiles = [...medicalDocFiles, ...newFiles];
      setMedicalDocFiles(updatedMedicalDocFiles);
      setParentFormData(prev => ({ ...prev, medicalDocumentFilesToUpload: updatedMedicalDocFiles.filter(f => f.isNew) }));
      toast({ title: "📄 PDFs Selected", description: `${newFiles.length} new document(s) ready. Save to upload.` });
    }
    if(medicalDocsInputRef.current) medicalDocsInputRef.current.value = ""; 
  };

  const removeMedicalDoc = (indexToRemove) => {
    const fileToRemove = medicalDocFiles[indexToRemove];
    const updatedFiles = medicalDocFiles.filter((_, index) => index !== indexToRemove);
    setMedicalDocFiles(updatedFiles);

    if (fileToRemove.isExisting) {
      setParentFormData(prev => ({
        ...prev,
        medicalDocumentUrls: prev.medicalDocumentUrls.filter(doc => doc.url !== fileToRemove.url),
        medicalDocumentsToRemove: [...(prev.medicalDocumentsToRemove || []), fileToRemove.url] 
      }));
    } else {
      setParentFormData(prev => ({
        ...prev,
        medicalDocumentFilesToUpload: updatedFiles.filter(f => f.isNew)
      }));
    }
    toast({ title: "🗑️ Document Removed", description: `${fileToRemove.name} has been removed from the list.` });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled) {
        toast({ title: "Login Required", description: "Please login to save your health card.", variant: "default" }); return;
    }
    if (validateForm()) {
      const dataToSubmit = {
        ...localFormData,
        medicalDocumentFilesToUpload: medicalDocFiles.filter(f => f.isNew).map(f => f.file),
        medicalDocumentsToRemove: medicalDocFiles.filter(f => f.isExisting && !localFormData.medicalDocumentUrls?.find(existingDoc => existingDoc.url === f.url)).map(f => f.url)
      };
      if (onSubmit) onSubmit(dataToSubmit);
      else toast({ title: "✅ Preview Updated!", description: "Your card preview is updated. Login to save." });
    } else {
      toast({ title: "❌ Validation Error", description: "Please check the form for errors and try again.", variant: "destructive" });
    }
  };

  const handleLocalReset = () => {
    if (disabled) {
        toast({ title: "Login Required", description: "Please login to manage your health card.", variant: "default" }); return;
    }
    onReset(); 
    setLocalFormData(initialFormData); 
    setProfilePicFileName('');
    setMedicalDocFiles(initialFormData.medicalDocumentUrls ? initialFormData.medicalDocumentUrls.map(doc => ({ name: doc.name || 'Uploaded Document', url: doc.url, isExisting: true })) : []);
    if(profilePicInputRef.current) profilePicInputRef.current.value = "";
    if(medicalDocsInputRef.current) medicalDocsInputRef.current.value = "";
  }

  const toggleSection = (section) => {
    if (section !== 'medical') { 
      setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    }
  };

  const formSections = [
    {
      key: 'essential', title: "Essential Information", icon: User,
      fields: [
        { key: 'profilePicture', label: 'Profile Picture', type: 'file', icon: ImageIcon, ref: profilePicInputRef, onChange: handleProfilePicChange, fileName: profilePicFileName, accept: "image/png, image/jpeg, image/webp", note: "Max 2MB (JPG, PNG, WEBP)" },
        { key: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'e.g., Jane Doe', icon: User },
        { key: 'age', label: 'Age', type: 'number', required: true, placeholder: 'e.g., 34', icon: Heart },
        { key: 'bloodGroup', label: 'Blood Group', type: 'select', required: true, options: bloodGroups, icon: Droplets },
        { key: 'emergencyContact', label: 'Emergency Contact', type: 'tel', required: true, placeholder: 'e.g., (123) 456-7890', icon: Phone },
      ]
    },
    {
      key: 'medical', title: "Detailed Medical History", icon: Activity,
      fields: [
        { key: 'allergies', label: 'Allergies', type: 'textarea', placeholder: 'e.g., Peanuts, Penicillin, Bee Stings', icon: Edit3 },
        { key: 'medicalConditions', label: 'Medical Conditions', type: 'textarea', placeholder: 'e.g., Asthma, Diabetes, Hypertension', icon: Edit3 },
        { key: 'medications', label: 'Current Medications', type: 'textarea', placeholder: 'e.g., Insulin (10 units daily), Albuterol Inhaler (as needed)', icon: Edit3, note: "You can paste links to medication lists (e.g., from Google Drive). Ensure link sharing allows anyone to view (read-only)." },
        { key: 'medicalDocuments', label: 'Medical Documents (PDFs)', type: 'multi-file', icon: FileText, ref: medicalDocsInputRef, onChange: handleMedicalDocsChange, files: medicalDocFiles, onRemove: removeMedicalDoc, accept: "application/pdf", note: "Upload relevant medical reports. Max 5MB per PDF." },
        { key: 'additionalNotes', label: 'Additional Notes', type: 'textarea', placeholder: 'e.g., Pacemaker, Organ Donor, Wears contacts', icon: Info },
        { key: 'healthReportLinks', label: 'Other Health Report Links', type: 'textarea', placeholder: 'Paste links to online reports (one per line)', icon: LinkIcon, note: "Paste links to PDFs or documents (e.g., from Google Drive). Ensure link sharing allows anyone with the link to view (read-only)." }
      ]
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
      <Card className={`bg-white rounded-xl shadow-lg border border-gray-200/50 overflow-hidden ${disabled ? 'opacity-70' : ''}`}>
        <CardHeader className="bg-gray-50 border-b border-gray-200 p-6">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-700">
            <Edit3 className="h-6 w-6 text-green-500" /> Create Your Health Card
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 mt-1">
            {disabled ? "Login to manage your card." : "Fill in your medical details. Required fields are marked with *." }
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {formSections.map((section, sectionIndex) => (
              <motion.div key={section.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: sectionIndex * 0.1, duration: 0.4 }} className="border border-gray-200 rounded-lg overflow-hidden">
                <button type="button" onClick={() => toggleSection(section.key)} disabled={section.key === 'medical' || disabled} className={`flex items-center justify-between w-full p-4 bg-gray-50  transition-colors ${section.key !== 'medical' && !disabled ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-default'}`}>
                  <div className="flex items-center gap-2">
                    <section.icon className={`h-5 w-5 ${openSections[section.key] ? 'text-green-600' : 'text-gray-500'}`} />
                    <h3 className={`text-md font-medium ${openSections[section.key] ? 'text-gray-700' : 'text-gray-600'}`}>{section.title}</h3>
                    {section.key === 'medical' && <span className="text-xs text-gray-400 font-normal">(Recommended)</span>}
                  </div>
                  {section.key !== 'medical' && (<ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${openSections[section.key] ? 'rotate-180 text-green-600' : ''}`} />)}
                </button>
                {(openSections[section.key] || section.key === 'medical') && (
                  <motion.div initial={{ opacity: 0, height: (openSections[section.key] || section.key === 'medical') ? 'auto' : 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: "circOut" }} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                      {section.fields.map((field) => (
                        <motion.div key={field.key} className={field.type === 'textarea' || field.type === 'file' || field.type === 'multi-file' ? 'md:col-span-2' : ''} initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.2, delay: Math.random()*0.1 }}>
                          <Label htmlFor={field.key} className={`flex items-center text-xs font-medium text-gray-600 mb-1 ${field.required ? "after:content-['*'] after:text-red-500 after:ml-0.5" : ''}`}>
                            {field.icon && <field.icon className="w-3.5 h-3.5 mr-1.5 text-gray-400" />} {field.label}
                          </Label>
                          {field.type === 'file' ? (
                            <>
                              <div className="flex items-center space-x-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => field.ref.current?.click()} className="flex-shrink-0" disabled={disabled || isSaving}>
                                  <UploadCloud className="w-4 h-4 mr-2" /> Choose File
                                </Button>
                                <Input id={field.key} type="file" ref={field.ref} onChange={field.onChange} className="hidden" accept={field.accept} disabled={disabled || isSaving} />
                                <span className="text-xs text-gray-500 truncate" title={field.fileName || "No file chosen"}>{field.fileName || "No file chosen"}</span>
                              </div>
                              {field.note && <p className="text-xs text-gray-500 mt-1.5">{field.note}</p>}
                            </>
                          ) : field.type === 'multi-file' ? (
                            <>
                              <div className="flex items-center space-x-2 mb-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => field.ref.current?.click()} className="flex-shrink-0" disabled={disabled || isSaving}>
                                  <UploadCloud className="w-4 h-4 mr-2" /> Add PDFs
                                </Button>
                                <Input id={field.key} type="file" ref={field.ref} onChange={field.onChange} className="hidden" accept={field.accept} multiple disabled={disabled || isSaving} />
                                {field.note && <p className="text-xs text-gray-500 mt-1.5 flex-grow">{field.note}</p>}
                              </div>
                              {field.files && field.files.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {field.files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-gray-50 text-xs">
                                      <div className="flex items-center gap-2 truncate">
                                        <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                                        <span className="truncate" title={file.name}>{file.name}</span>
                                        {file.isExisting && <span className="text-green-600 text-[10px]">(Uploaded)</span>}
                                        {file.isNew && <span className="text-blue-600 text-[10px]">(New)</span>}
                                      </div>
                                      <Button type="button" variant="ghost" size="sm" onClick={() => field.onRemove(index)} disabled={disabled || isSaving} className="p-1 h-auto">
                                        <XCircle className="w-4 h-4 text-gray-500 hover:text-red-500" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          ) : field.type === 'select' ? (
                            <Select value={localFormData[field.key] || ''} onValueChange={(value) => handleInputChange(field.key, value)} disabled={disabled || isSaving}>
                              <SelectTrigger className={`w-full text-sm ${errors[field.key] ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'} transition-all`}>
                                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                              </SelectTrigger>
                              <SelectContent>{field.options.map((option) => (<SelectItem key={option} value={option} className="text-sm">{option}</SelectItem>))}</SelectContent>
                            </Select>
                          ) : field.type === 'textarea' ? (
                            <>
                              <Textarea id={field.key} value={localFormData[field.key] || ''} onChange={(e) => handleInputChange(field.key, e.target.value)} placeholder={field.placeholder} className={`w-full min-h-[80px] text-sm ${errors[field.key] ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'} transition-all`} disabled={disabled || isSaving} />
                              {field.note && <p className="text-xs text-gray-500 mt-1.5">{field.note}</p>}
                            </>
                          ) : (
                            <Input id={field.key} type={field.type} value={localFormData[field.key] || ''} onChange={(e) => handleInputChange(field.key, e.target.value)} placeholder={field.placeholder} className={`w-full text-sm ${errors[field.key] ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'} transition-all`} min={field.type === 'number' ? 1 : undefined} max={field.type === 'number' ? 150 : undefined} disabled={disabled || isSaving} />
                          )}
                          {errors[field.key] && (<motion.p initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} className="text-red-600 text-xs mt-1">{errors[field.key]}</motion.p>)}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
            <motion.div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <Button type="submit" size="default" className="flex-1 creative-gradient text-white hover:opacity-90 transition-opacity shadow-sm hover:shadow-md" disabled={isSaving || disabled}>
                {isSaving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" /> } {isSaving ? 'Saving...' : 'Save & Update Card'}
              </Button>
              <Button type="button" variant="outline" size="default" onClick={handleLocalReset} className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm hover:shadow-md transition-all" disabled={isSaving || disabled}>
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reset Form
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HealthForm;