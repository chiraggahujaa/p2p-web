"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { DigiLockerVerification } from "@/features/kyc/components/DigiLockerVerification";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

export default function KycPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Show success message if redirected after successful verification
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success("KYC verification completed successfully!");
    }
  }, [searchParams]);

  const handleSuccess = (data: unknown) => {
    toast.success("KYC verification completed successfully!");
    // Redirect to profile or dashboard after successful verification
    setTimeout(() => {
      router.push("/profile");
    }, 2000);
  };

  const handleError = (error: string) => {
    toast.error(error || "KYC verification failed. Please try again.");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Identity Verification</h1>
          <p className="text-muted-foreground">
            Verify your identity securely through DigiLocker to unlock all platform features and build trust with other users.
          </p>
        </div>

        {/* Success Alert */}
        {searchParams.get('success') === 'true' && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your KYC verification has been completed successfully! You now have access to all platform features.
            </AlertDescription>
          </Alert>
        )}

        {/* DigiLocker KYC Verification Component */}
        <DigiLockerVerification 
          onSuccess={handleSuccess}
          onError={handleError}
        />

        {/* What is DigiLocker Info */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">What is DigiLocker?</h3>
          <p className="text-sm text-blue-800 mb-3">
            DigiLocker is a secure digital platform by the Government of India that stores 
            your documents digitally and allows safe sharing with verified services.
          </p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Government-backed digital document storage</li>
            <li>• ISO 27001 certified for security</li>
            <li>• Documents are directly fetched from government databases</li>
            <li>• Your consent is required for each document access</li>
          </ul>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Having trouble? Contact our{" "}
            <a href="/support" className="text-primary hover:underline">
              support team
            </a>{" "}
            for assistance or check the{" "}
            <a 
              href="https://digilocker.gov.in/faq" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              DigiLocker FAQ
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}


