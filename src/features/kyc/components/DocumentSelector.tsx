"use client";

import { useState } from "react";
import { DocumentType, DOCUMENT_OPTIONS, DocumentSelectorProps } from "../types/digilockerTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, CheckCircle2, FileText } from "lucide-react";

interface ExtendedDocumentSelectorProps extends DocumentSelectorProps {
  onInitiate: () => void;
  isInitiating: boolean;
}

export function DocumentSelector({
  selectedDocuments,
  onDocumentsChange,
  disabled = false,
  onInitiate,
  isInitiating,
}: ExtendedDocumentSelectorProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleDocumentToggle = (documentId: DocumentType) => {
    if (disabled) return;

    // Aadhaar is always required
    if (documentId === 'aadhaar') return;

    if (selectedDocuments.includes(documentId)) {
      onDocumentsChange(selectedDocuments.filter(doc => doc !== documentId));
    } else {
      onDocumentsChange([...selectedDocuments, documentId]);
    }
  };

  const canProceed = selectedDocuments.length > 0 && agreedToTerms && !disabled;

  return (
    <div className="space-y-6">
      {/* Information */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Select the documents you want to verify through DigiLocker. 
          You&apos;ll be redirected to DigiLocker to provide consent for document access.
        </AlertDescription>
      </Alert>

      {/* Document Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Select Documents to Verify</h3>
        <div className="grid gap-3">
          {DOCUMENT_OPTIONS.map((option) => {
            const isSelected = selectedDocuments.includes(option.id);
            const isRequired = option.required;
            const isDisabled = disabled || (isRequired && isSelected);

            return (
              <Card key={option.id} className={`cursor-pointer transition-all ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
              } ${isDisabled ? 'opacity-60' : ''}`}>
                <CardContent className="flex items-center space-x-3 p-4">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleDocumentToggle(option.id)}
                    disabled={isDisabled}
                  />
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-2xl">{option.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{option.label}</h4>
                        {isRequired && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Selected Documents Summary */}
      {selectedDocuments.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-blue-800">Selected Documents</h4>
            </div>
            <div className="text-sm text-blue-700">
              {selectedDocuments.map(docId => {
                const option = DOCUMENT_OPTIONS.find(opt => opt.id === docId);
                return option ? option.label : docId;
              }).join(', ')}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Terms and Conditions */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              disabled={disabled}
            />
            <div className="text-sm text-gray-700 leading-relaxed">
              I consent to sharing my document information from DigiLocker with this platform 
              for KYC verification purposes. I understand that:
              <ul className="mt-2 ml-4 space-y-1 list-disc">
                <li>My documents will be temporarily accessed from DigiLocker</li>
                <li>Document data will be stored securely and deleted after verification</li>
                <li>I can revoke access at any time through DigiLocker</li>
                <li>This verification complies with applicable data protection laws</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onInitiate}
          disabled={!canProceed || isInitiating}
          className="flex-1"
        >
          {isInitiating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Initiating Session...
            </>
          ) : (
            'Start DigiLocker Verification'
          )}
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-500 text-center">
        DigiLocker is a secure digital platform by the Government of India for 
        document storage and sharing.
      </div>
    </div>
  );
}