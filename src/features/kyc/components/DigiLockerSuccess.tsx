"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DigiLockerSuccessProps, DOCUMENT_TYPE_LABELS } from "../types/digilockerTypes";
import { 
  CheckCircle, 
  FileText, 
  Calendar, 
  Shield, 
  Eye
} from "lucide-react";

export function DigiLockerSuccess({ 
  verifiedData, 
  onViewDocuments,
  onClose 
}: DigiLockerSuccessProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">
            KYC Verification Successful!
          </h2>
          <p className="text-green-700">
            Your identity has been successfully verified through DigiLocker.
            You now have full access to all platform features.
          </p>
        </CardContent>
      </Card>

      {/* Verification Summary */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="mr-2 h-5 w-5 text-blue-600" />
            Verification Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Verification ID</label>
              <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                {verifiedData.verificationId}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Verified At</label>
              <p className="text-sm text-gray-900 flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {formatDate(verifiedData.verificationTimestamp)}
              </p>
            </div>
          </div>

          {/* Documents List */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Verified Documents ({verifiedData.documents.length})
            </h4>
            
            <div className="space-y-2">
              {verifiedData.documents.map((doc) => (
                <Card key={doc.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {DOCUMENT_TYPE_LABELS[doc.documentType] || doc.documentType}
                          </h5>
                          <p className="text-sm text-gray-600">{doc.documentName}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span>{formatFileSize(doc.fileSize)}</span>
                            <span>{doc.mimeType}</span>
                            <span>Downloaded: {formatDate(doc.downloadedAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Data Privacy:</strong> Your document data is stored securely and will be 
          automatically deleted from our servers after the verification period expires. 
          Only necessary information is retained for compliance purposes.
        </AlertDescription>
      </Alert>

      {/* Next Steps */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">What&apos;s Next?</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <CheckCircle className="mr-2 h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>You can now list items for sharing on the platform</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="mr-2 h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Make bookings and transactions with verified users</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="mr-2 h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Access premium features and higher trust score</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="mr-2 h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Build your reputation in the community</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {onViewDocuments && (
          <Button
            variant="outline"
            onClick={onViewDocuments}
            className="flex-1"
          >
            <Eye className="mr-2 h-4 w-4" />
            View My Documents
          </Button>
        )}
        
        <Button
          onClick={onClose}
          className="flex-1"
        >
          Continue to Platform
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Your KYC verification is now complete. This status will be reflected 
          across all your interactions on the platform.
        </p>
      </div>
    </div>
  );
}