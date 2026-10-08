'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  FileText,
  Award,
  Shield,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Save,
  Mail,
  Phone,
  CreditCard as IdCard,
  IndianRupee,
  School,
  Upload as UploadIcon
} from 'lucide-react';
import FormInput from '@/components/student/FormInput';
import FileUpload from '@/components/student/FileUpload';
import FormSection from '@/components/student/FormSection';
import ProgressStepper from '@/components/student/ProgressStepper';

interface PersonalInfo {
  email: string;
  mobile: string;
  aadhaar: string;
  parentIncome: string;
}

interface AcademicDocs {
  class10: File | null;
  class12: File | null;
  hscPlus1: File | null;
  transferCertificate: File | null;
  schoolName: string;
  boardName: string;
}

interface EligibilityCerts {
  communityCert: File | null;
  nativityCert: File | null;
  firstGraduateCert: File | null;
  firstGraduateDeclaration: boolean;
}

interface SpecialReservationCerts {
  exServicemenCert: File | null;
  differentlyAbledCert: File | null;
  sportsPersonCert: File | null;
  sriLankanTamilCert: File | null;
}

interface ApplicationDetails {
  photograph: File | null;
  signature: File | null;
  paymentMode: string;
  transactionId: string;
  paymentStatus: string;
}

interface FormData {
  personal: PersonalInfo;
  academic: AcademicDocs;
  eligibility: EligibilityCerts;
  specialReservation: SpecialReservationCerts;
  application: ApplicationDetails;
}

const STEPS = [
  { id: 1, title: 'Personal Info', description: 'Contact & Income' },
  { id: 2, title: 'Academic Docs', description: 'Mark Sheets & TC' },
  { id: 3, title: 'Eligibility', description: 'Certificates' },
  { id: 4, title: 'Special Quota', description: 'Reservation Certs' },
  { id: 5, title: 'Application', description: 'Photo & Payment' }
];

export default function StudentApplicationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    personal: {
      email: '',
      mobile: '',
      aadhaar: '',
      parentIncome: ''
    },
    academic: {
      class10: null,
      class12: null,
      hscPlus1: null,
      transferCertificate: null,
      schoolName: '',
      boardName: ''
    },
    eligibility: {
      communityCert: null,
      nativityCert: null,
      firstGraduateCert: null,
      firstGraduateDeclaration: false
    },
    specialReservation: {
      exServicemenCert: null,
      differentlyAbledCert: null,
      sportsPersonCert: null,
      sriLankanTamilCert: null
    },
    application: {
      photograph: null,
      signature: null,
      paymentMode: '',
      transactionId: '',
      paymentStatus: 'Pending'
    }
  });

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('studentApplicationData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Note: Files won't be restored from localStorage, only the form fields
        setFormData(prev => ({
          ...prev,
          personal: parsed.personal || prev.personal,
          academic: {
            ...prev.academic,
            schoolName: parsed.academic?.schoolName || '',
            boardName: parsed.academic?.boardName || ''
          },
          eligibility: {
            ...prev.eligibility,
            firstGraduateDeclaration: parsed.eligibility?.firstGraduateDeclaration || false
          },
          application: {
            ...prev.application,
            paymentMode: parsed.application?.paymentMode || '',
            transactionId: parsed.application?.transactionId || '',
            paymentStatus: parsed.application?.paymentStatus || 'Pending'
          }
        }));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever formData changes
  const saveToLocalStorage = async () => {
    const dataToSave = {
      personal: formData.personal,
      academic: {
        schoolName: formData.academic.schoolName,
        boardName: formData.academic.boardName
      },
      eligibility: {
        firstGraduateDeclaration: formData.eligibility.firstGraduateDeclaration
      },
      application: {
        paymentMode: formData.application.paymentMode,
        transactionId: formData.application.transactionId,
        paymentStatus: formData.application.paymentStatus
      }
    };
    localStorage.setItem('studentApplicationData', JSON.stringify(dataToSave));

    // Save to Database via API
    try {
      await fetch('/api/student/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: formData.personal.mobile,
          district: '', // can be added to personal data later if needed
          applicationStatus: formData.application.paymentStatus === 'Paid' ? 'VERIFIED' : 'REGISTERED'
        })
      });
    } catch (e) {
      console.error("DB sync failed", e);
    }
  };

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [e.target.name]: e.target.value
      }
    }));
  };

  const handleAcademicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      academic: {
        ...prev.academic,
        [e.target.name]: e.target.value
      }
    }));
  };

  const handleApplicationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      application: {
        ...prev.application,
        [e.target.name]: e.target.value
      }
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        const { email, mobile, aadhaar, parentIncome } = formData.personal;
        if (!email || !mobile || !aadhaar || !parentIncome) {
          alert('Please fill all required fields in Personal Information');
          return false;
        }
        if (!/^\d{12}$/.test(aadhaar)) {
          alert('Aadhaar must be 12 digits');
          return false;
        }
        if (!/^\d{10}$/.test(mobile)) {
          alert('Mobile number must be 10 digits');
          return false;
        }
        return true;
      
      case 2:
        const { class10, class12, transferCertificate, schoolName, boardName } = formData.academic;
        if (!class10 || !class12 || !transferCertificate || !schoolName || !boardName) {
          alert('Please upload all required documents and fill school details');
          return false;
        }
        return true;
      
      case 3:
        const { communityCert, nativityCert } = formData.eligibility;
        if (!communityCert || !nativityCert) {
          alert('Please upload Community and Nativity certificates');
          return false;
        }
        return true;
      
      case 4:
        // Special reservation certificates are optional
        return true;
      
      case 5:
        const { photograph, signature, paymentMode, transactionId } = formData.application;
        if (!photograph || !signature || !paymentMode || !transactionId) {
          alert('Please complete all application details including photo, signature, and payment information');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      saveToLocalStorage();
      if (currentStep < STEPS.length) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(async () => {
      await saveToLocalStorage();
      alert('Application submitted successfully! (Mock submission)');
      setIsLoading(false);
      router.push('/student/dashboard');
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormSection
            title="Personal & Contact Information"
            description="Provide your contact details and family income information"
            icon={<User className="h-6 w-6 text-indigo-600" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Email ID"
                name="email"
                type="email"
                value={formData.personal.email}
                onChange={handlePersonalChange}
                placeholder="student@example.com"
                required
                icon={<Mail className="h-5 w-5" />}
              />
              <FormInput
                label="Mobile Number"
                name="mobile"
                type="tel"
                value={formData.personal.mobile}
                onChange={handlePersonalChange}
                placeholder="9876543210"
                required
                pattern="[0-9]{10}"
                icon={<Phone className="h-5 w-5" />}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Aadhaar Number"
                name="aadhaar"
                type="text"
                value={formData.personal.aadhaar}
                onChange={handlePersonalChange}
                placeholder="123456789012"
                required
                pattern="[0-9]{12}"
                icon={<IdCard className="h-5 w-5" />}
              />
              <FormInput
                label="Parent Annual Income (₹)"
                name="parentIncome"
                type="number"
                value={formData.personal.parentIncome}
                onChange={handlePersonalChange}
                placeholder="500000"
                required
                icon={<IndianRupee className="h-5 w-5" />}
              />
            </div>
          </FormSection>
        );

      case 2:
        return (
          <FormSection
            title="Academic Documents"
            description="Upload your mark sheets and school documents"
            icon={<FileText className="h-6 w-6 text-indigo-600" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUpload
                label="Class 10th Mark Sheet"
                name="class10"
                onChange={(file) => setFormData(prev => ({
                  ...prev,
                  academic: { ...prev.academic, class10: file }
                }))}
                currentFile={formData.academic.class10}
                required
              />
              <FileUpload
                label="Class 12th Mark Sheet"
                name="class12"
                onChange={(file) => setFormData(prev => ({
                  ...prev,
                  academic: { ...prev.academic, class12: file }
                }))}
                currentFile={formData.academic.class12}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUpload
                label="HSC (+1) Mark Sheet"
                name="hscPlus1"
                onChange={(file) => setFormData(prev => ({
                  ...prev,
                  academic: { ...prev.academic, hscPlus1: file }
                }))}
                currentFile={formData.academic.hscPlus1}
              />
              <FileUpload
                label="Transfer Certificate (TC)"
                name="transferCertificate"
                onChange={(file) => setFormData(prev => ({
                  ...prev,
                  academic: { ...prev.academic, transferCertificate: file }
                }))}
                currentFile={formData.academic.transferCertificate}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormInput
                label="School Name"
                name="schoolName"
                value={formData.academic.schoolName}
                onChange={handleAcademicChange}
                placeholder="Enter your school name"
                required
                icon={<School className="h-5 w-5" />}
              />
              <FormInput
                label="Board Name"
                name="boardName"
                value={formData.academic.boardName}
                onChange={handleAcademicChange}
                placeholder="e.g., CBSE, State Board"
                required
                icon={<FileText className="h-5 w-5" />}
              />
            </div>
          </FormSection>
        );

      case 3:
        return (
          <FormSection
            title="Eligibility & Reservation Certificates"
            description="Upload required eligibility certificates"
            icon={<Award className="h-6 w-6 text-indigo-600" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUpload
                label="Community Certificate"
                name="communityCert"
                onChange={(file) => setFormData(prev => ({
                  ...prev,
                  eligibility: { ...prev.eligibility, communityCert: file }
                }))}
                currentFile={formData.eligibility.communityCert}
                required
              />
              <FileUpload
                label="Nativity Certificate"
                name="nativityCert"
                onChange={(file) => setFormData(prev => ({
                  ...prev,
                  eligibility: { ...prev.eligibility, nativityCert: file }
                }))}
                currentFile={formData.eligibility.nativityCert}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUpload
                label="First Graduate Certificate (if applicable)"
                name="firstGraduateCert"
                onChange={(file) => setFormData(prev => ({
                  ...prev,
                  eligibility: { ...prev.eligibility, firstGraduateCert: file }
                }))}
                currentFile={formData.eligibility.firstGraduateCert}
              />
              <div className="flex items-center h-full">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.eligibility.firstGraduateDeclaration}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      eligibility: { ...prev.eligibility, firstGraduateDeclaration: e.target.checked }
                    }))}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">
                    I declare that I am the first graduate in my family
                  </span>
                </label>
              </div>
            </div>
          </FormSection>
        );

      case 4:
        return (
          <FormSection
            title="Special Reservation Certificates"
            description="Upload applicable special category certificates (Optional)"
            icon={<Shield className="h-6 w-6 text-indigo-600" />}
          >
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Upload certificates only if you belong to any of these special categories. These are optional.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUpload
                label="Ex-Servicemen Certificate"
                name="exServicemenCert"
                onChange={(file) => setFormData(prev => ({
                  ...prev,
                  specialReservation: { ...prev.specialReservation, exServicemenCert: file }
                }))}
                currentFile={formData.specialReservation.exServicemenCert}
              />
              <FileUpload
                label="Differently Abled Certificate"
                name="differentlyAbledCert"
                onChange={(file) => setFormData(prev => ({
                  ...prev,
                  specialReservation: { ...prev.specialReservation, differentlyAbledCert: file }
                }))}
                currentFile={formData.specialReservation.differentlyAbledCert}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUpload
                label="Eminent Sportsperson Certificate"
                name="sportsPersonCert"
                onChange={(file) => setFormData(prev => ({
                  ...prev,
                  specialReservation: { ...prev.specialReservation, sportsPersonCert: file }
                }))}
                currentFile={formData.specialReservation.sportsPersonCert}
              />
              <FileUpload
                label="Sri Lankan Tamil Refugee Certificate"
                name="sriLankanTamilCert"
                onChange={(file) => setFormData(prev => ({
                  ...prev,
                  specialReservation: { ...prev.specialReservation, sriLankanTamilCert: file }
                }))}
                currentFile={formData.specialReservation.sriLankanTamilCert}
              />
            </div>
          </FormSection>
        );

      case 5:
        return (
          <FormSection
            title="Online Application Details"
            description="Upload your photograph, signature and payment information"
            icon={<CreditCard className="h-6 w-6 text-indigo-600" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUpload
                label="Passport-size Photograph"
                name="photograph"
                onChange={(file) => setFormData(prev => ({
                  ...prev,
                  application: { ...prev.application, photograph: file }
                }))}
                currentFile={formData.application.photograph}
                accept=".jpg,.jpeg,.png"
                maxSize={2}
                required
              />
              <FileUpload
                label="Signature"
                name="signature"
                onChange={(file) => setFormData(prev => ({
                  ...prev,
                  application: { ...prev.application, signature: file }
                }))}
                currentFile={formData.application.signature}
                accept=".jpg,.jpeg,.png"
                maxSize={1}
                required
              />
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Application Fee Payment Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Mode <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="paymentMode"
                    name="paymentMode"
                    value={formData.application.paymentMode}
                    onChange={handleApplicationChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select Payment Mode</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="UPI">UPI</option>
                  </select>
                </div>
                <FormInput
                  label="Transaction ID"
                  name="transactionId"
                  value={formData.application.transactionId}
                  onChange={handleApplicationChange}
                  placeholder="Enter transaction ID"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="paymentStatus"
                    name="paymentStatus"
                    value={formData.application.paymentStatus}
                    onChange={handleApplicationChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <div className={`w-full px-4 py-3 rounded-lg text-center font-semibold ${
                    formData.application.paymentStatus === 'Paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    Status: {formData.application.paymentStatus}
                  </div>
                </div>
              </div>
            </div>
          </FormSection>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Application Form</h1>
          <p className="text-gray-600">Complete all sections to submit your TNEA application</p>
        </div>

        {/* Progress Stepper */}
        <ProgressStepper steps={STEPS} currentStep={currentStep} />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Previous</span>
            </button>

            <div className="text-sm text-gray-600">
              Step {currentStep} of {STEPS.length}
            </div>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all"
              >
                <Save className="h-5 w-5" />
                <span>Save & Continue</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-all ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <UploadIcon className="h-5 w-5" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
