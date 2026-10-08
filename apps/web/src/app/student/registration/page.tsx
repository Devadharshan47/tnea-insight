'use client';

import React, { useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  User, Mail, Phone, Hash, IndianRupee, GraduationCap, 
  Upload, FileText, Award, Shield, Camera, CreditCard,
  CheckCircle, AlertCircle, Save, Send
} from 'lucide-react';

interface RegistrationData {
  // Personal Information
  email: string;
  mobile: string;
  aadhaar: string;
  parentIncome: string;
  
  // Academic Documents
  class10Marksheet: File | null;
  class12Marksheet: File | null;
  hscMarksheet: File | null;
  schoolName: string;
  schoolDistrict: string;
  transferCertificate: File | null;
  
  // Eligibility Certificates
  community: string;
  communityCertificate: File | null;
  nativityCertificate: File | null;
  firstGraduate: boolean;
  firstGraduateCertificate: File | null;
  
  // Special Reservation
  exServicemen: boolean;
  exServicemenCertificate: File | null;
  differentlyAbled: boolean;
  differentlyAbledCertificate: File | null;
  sportsPerson: boolean;
  sportsPersonCertificate: File | null;
  sriLankanRefugee: boolean;
  sriLankanRefugeeCertificate: File | null;
  
  // Application Details
  photograph: File | null;
  signature: File | null;
  feePaymentStatus: 'pending' | 'completed';
  transactionId: string;
}

export default function StudentRegistrationPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>({
    email: user?.email || '',
    mobile: '',
    aadhaar: '',
    parentIncome: '',
    class10Marksheet: null,
    class12Marksheet: null,
    hscMarksheet: null,
    schoolName: '',
    schoolDistrict: '',
    transferCertificate: null,
    community: '',
    communityCertificate: null,
    nativityCertificate: null,
    firstGraduate: false,
    firstGraduateCertificate: null,
    exServicemen: false,
    exServicemenCertificate: null,
    differentlyAbled: false,
    differentlyAbledCertificate: null,
    sportsPerson: false,
    sportsPersonCertificate: null,
    sriLankanRefugee: false,
    sriLankanRefugeeCertificate: null,
    photograph: null,
    signature: null,
    feePaymentStatus: 'pending',
    transactionId: ''
  });

  const [savedData, setSavedData] = useState<RegistrationData | null>(null);

  // Load saved data from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem(`tnea_registration_${user?.id}`);
    if (saved) {
      const parsedData = JSON.parse(saved);
      setSavedData(parsedData);
      setFormData(prev => ({ ...prev, ...parsedData }));
    }
  }, [user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof RegistrationData) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [fieldName]: file }));
  };

  const saveProgress = async () => {
    // Save to localStorage as backup
    const dataToSave = { ...formData };
    localStorage.setItem(`tnea_registration_${user?.id}`, JSON.stringify(dataToSave));
    setSavedData(dataToSave);
    
    // Save to Database
    try {
      const res = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: formData.mobile,
          category: formData.community,
          district: formData.schoolDistrict,
          applicationStatus: formData.feePaymentStatus === 'completed' ? 'VERIFIED' : 'REGISTERED'
        })
      });
      if (res.ok) {
        alert('Progress saved successfully to database!');
      } else {
        alert('Saved locally. Backend sync failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Saved locally. Backend sync failed.');
    }
  };

  const handleSubmit = async () => {
    // Validate all required fields
    if (!formData.email || !formData.mobile || !formData.aadhaar) {
      alert('Please fill all personal information');
      setCurrentStep(1);
      return;
    }
    
    if (!formData.class10Marksheet || !formData.class12Marksheet) {
      alert('Please upload required academic documents');
      setCurrentStep(2);
      return;
    }

    if (!formData.photograph || !formData.signature) {
      alert('Please upload photograph and signature');
      setCurrentStep(4);
      return;
    }

    if (formData.feePaymentStatus !== 'completed') {
      alert('Please complete the application fee payment');
      setCurrentStep(4);
      return;
    }

    // Save final submission locally
    const submissionData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      registrationNumber: `TNEA2025${Math.floor(Math.random() * 100000)}`
    };
    
    localStorage.setItem(`tnea_registration_${user?.id}`, JSON.stringify(submissionData));
    localStorage.setItem(`tnea_registration_submitted_${user?.id}`, 'true');

    // Save to Database
    try {
      await fetch('/api/student/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: formData.mobile,
          category: formData.community,
          district: formData.schoolDistrict,
          applicationStatus: 'VERIFIED'
        })
      });
    } catch (e) {
      console.error("DB sync failed", e);
    }
    
    alert(`Registration submitted successfully! Your Registration Number: ${submissionData.registrationNumber}`);
    router.push('/student/dashboard');
  };

  const steps = [
    { id: 1, name: 'Personal Info', icon: User },
    { id: 2, name: 'Academic Docs', icon: GraduationCap },
    { id: 3, name: 'Certificates', icon: Award },
    { id: 4, name: 'Upload & Pay', icon: Upload }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TNEA 2025 Counselling Registration</h1>
          <p className="text-gray-600">Complete your registration to participate in the counselling process</p>
          
          {savedData && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Previously saved data loaded</p>
                <p className="text-xs text-green-700 mt-1">You can continue from where you left off</p>
              </div>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      currentStep >= step.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    <step.icon className="h-6 w-6" />
                  </div>
                  <p className={`mt-2 text-sm font-medium ${
                    currentStep >= step.id ? 'text-indigo-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-indigo-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-6 w-6 text-indigo-600" />
                Personal and Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="student@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhaar Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="aadhaar"
                      value={formData.aadhaar}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="12-digit Aadhaar number"
                      maxLength={12}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Annual Income <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      name="parentIncome"
                      value={formData.parentIncome}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select income range</option>
                      <option value="below-1-lakh">Below ₹1 Lakh</option>
                      <option value="1-2.5-lakh">₹1 - 2.5 Lakh</option>
                      <option value="2.5-5-lakh">₹2.5 - 5 Lakh</option>
                      <option value="5-8-lakh">₹5 - 8 Lakh</option>
                      <option value="above-8-lakh">Above ₹8 Lakh</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Academic Documents */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-indigo-600" />
                Academic Documents
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class 10th Mark Sheet <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition-colors">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'class10Marksheet')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        id="class10"
                      />
                      <label htmlFor="class10" className="cursor-pointer flex items-center gap-3">
                        <Upload className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.class10Marksheet?.name || 'Click to upload (PDF, JPG, PNG)'}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class 12th Mark Sheet <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition-colors">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'class12Marksheet')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        id="class12"
                      />
                      <label htmlFor="class12" className="cursor-pointer flex items-center gap-3">
                        <Upload className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.class12Marksheet?.name || 'Click to upload (PDF, JPG, PNG)'}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      HSC (+1) Mark Sheet <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition-colors">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'hscMarksheet')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        id="hsc"
                      />
                      <label htmlFor="hsc" className="cursor-pointer flex items-center gap-3">
                        <Upload className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.hscMarksheet?.name || 'Click to upload (PDF, JPG, PNG)'}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transfer Certificate (TC) <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition-colors">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'transferCertificate')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        id="tc"
                      />
                      <label htmlFor="tc" className="cursor-pointer flex items-center gap-3">
                        <Upload className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.transferCertificate?.name || 'Click to upload (PDF, JPG, PNG)'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your school name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School District <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="schoolDistrict"
                      value={formData.schoolDistrict}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter school district"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Certificates */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Award className="h-6 w-6 text-indigo-600" />
                Certificates for Eligibility and Reservation
              </h2>

              {/* Basic Certificates */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Basic Eligibility Certificates</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Community <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="community"
                      value={formData.community}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select community</option>
                      <option value="OC">OC - Open Competition</option>
                      <option value="BC">BC - Backward Class</option>
                      <option value="BCM">BCM - Backward Class Muslim</option>
                      <option value="MBC">MBC - Most Backward Class</option>
                      <option value="SC">SC - Scheduled Caste</option>
                      <option value="SCA">SCA - Scheduled Caste Arunthathiyar</option>
                      <option value="ST">ST - Scheduled Tribe</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Community Certificate <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition-colors">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'communityCertificate')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        id="community"
                      />
                      <label htmlFor="community" className="cursor-pointer flex items-center gap-3">
                        <Upload className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.communityCertificate?.name || 'Click to upload'}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nativity Certificate <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition-colors">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'nativityCertificate')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        id="nativity"
                      />
                      <label htmlFor="nativity" className="cursor-pointer flex items-center gap-3">
                        <Upload className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.nativityCertificate?.name || 'Click to upload'}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        name="firstGraduate"
                        checked={formData.firstGraduate}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        id="firstGrad"
                      />
                      <label htmlFor="firstGrad" className="text-sm font-medium text-gray-700">
                        First Graduate in Family
                      </label>
                    </div>
                    {formData.firstGraduate && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition-colors">
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, 'firstGraduateCertificate')}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          id="firstGradCert"
                        />
                        <label htmlFor="firstGradCert" className="cursor-pointer flex items-center gap-3">
                          <Upload className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formData.firstGraduateCertificate?.name || 'Upload certificate & declaration'}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Special Reservation */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="font-medium text-gray-900">Special Reservation Categories</h3>
                
                <div className="space-y-4">
                  {/* Ex-Servicemen */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        name="exServicemen"
                        checked={formData.exServicemen}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        id="exServ"
                      />
                      <label htmlFor="exServ" className="text-sm font-medium text-gray-700">
                        Ex-Servicemen
                      </label>
                    </div>
                    {formData.exServicemen && (
                      <div className="ml-6 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition-colors">
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, 'exServicemenCertificate')}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          id="exServCert"
                        />
                        <label htmlFor="exServCert" className="cursor-pointer flex items-center gap-3">
                          <Shield className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formData.exServicemenCertificate?.name || 'Upload Ex-Servicemen certificate'}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Differently Abled */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        name="differentlyAbled"
                        checked={formData.differentlyAbled}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        id="diffAbled"
                      />
                      <label htmlFor="diffAbled" className="text-sm font-medium text-gray-700">
                        Differently Abled Person (PWD)
                      </label>
                    </div>
                    {formData.differentlyAbled && (
                      <div className="ml-6 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition-colors">
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, 'differentlyAbledCertificate')}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          id="diffAbledCert"
                        />
                        <label htmlFor="diffAbledCert" className="cursor-pointer flex items-center gap-3">
                          <Shield className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formData.differentlyAbledCertificate?.name || 'Upload Disability certificate'}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Sports Person */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        name="sportsPerson"
                        checked={formData.sportsPerson}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        id="sports"
                      />
                      <label htmlFor="sports" className="text-sm font-medium text-gray-700">
                        Eminent Sports Person
                      </label>
                    </div>
                    {formData.sportsPerson && (
                      <div className="ml-6 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition-colors">
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, 'sportsPersonCertificate')}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          id="sportsCert"
                        />
                        <label htmlFor="sportsCert" className="cursor-pointer flex items-center gap-3">
                          <Award className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formData.sportsPersonCertificate?.name || 'Upload Sports achievement certificate'}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Sri Lankan Tamil Refugee */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        name="sriLankanRefugee"
                        checked={formData.sriLankanRefugee}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        id="refugee"
                      />
                      <label htmlFor="refugee" className="text-sm font-medium text-gray-700">
                        Sri Lankan Tamil Refugee
                      </label>
                    </div>
                    {formData.sriLankanRefugee && (
                      <div className="ml-6 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition-colors">
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, 'sriLankanRefugeeCertificate')}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          id="refugeeCert"
                        />
                        <label htmlFor="refugeeCert" className="cursor-pointer flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formData.sriLankanRefugeeCertificate?.name || 'Upload Refugee certificate'}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Upload & Payment */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Camera className="h-6 w-6 text-indigo-600" />
                Digital Uploads and Payment
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photograph <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-500 transition-colors">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'photograph')}
                      accept="image/*"
                      className="hidden"
                      id="photo"
                    />
                    <label htmlFor="photo" className="cursor-pointer flex flex-col items-center gap-3">
                      <Camera className="h-8 w-8 text-gray-400" />
                      <div className="text-center">
                        <span className="text-sm text-gray-600 block">
                          {formData.photograph?.name || 'Upload passport size photo'}
                        </span>
                        <span className="text-xs text-gray-500">JPG, PNG (Max 200KB)</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Signature <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-500 transition-colors">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'signature')}
                      accept="image/*"
                      className="hidden"
                      id="sign"
                    />
                    <label htmlFor="sign" className="cursor-pointer flex flex-col items-center gap-3">
                      <FileText className="h-8 w-8 text-gray-400" />
                      <div className="text-center">
                        <span className="text-sm text-gray-600 block">
                          {formData.signature?.name || 'Upload signature'}
                        </span>
                        <span className="text-xs text-gray-500">JPG, PNG (Max 100KB)</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="border-t pt-6 mt-6">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-indigo-600" />
                  Application Fee Payment
                </h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">Fee Details:</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• General/OBC: ₹500</li>
                    <li>• SC/ST: ₹250</li>
                    <li>• Payment modes: Credit Card, Debit Card, Net Banking, UPI</li>
                  </ul>
                </div>

                {formData.feePaymentStatus === 'completed' ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Payment Completed</p>
                        <p className="text-sm text-green-700">Transaction ID: {formData.transactionId}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transaction ID (After Payment) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter transaction ID after payment"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (formData.transactionId) {
                          setFormData(prev => ({ ...prev, feePaymentStatus: 'completed' }));
                          alert('Payment verified successfully!');
                        } else {
                          alert('Please enter transaction ID');
                        }
                      }}
                      className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium flex items-center justify-center gap-2"
                    >
                      <CreditCard className="h-5 w-5" />
                      Proceed to Payment Gateway (Demo)
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg font-medium ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>

          <button
            onClick={saveProgress}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
          >
            <Save className="h-5 w-5" />
            Save Progress
          </button>

          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2"
            >
              <Send className="h-5 w-5" />
              Submit Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
