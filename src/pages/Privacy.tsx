
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/profile")}
          className="text-gray-600 hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-black text-xl font-medium">Privacy Policy</h1>
        <div className="w-10"></div> {/* Spacer for center alignment */}
      </div>

      {/* Content */}
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <div className="space-y-6 text-black">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Privacy Policy for Hygge</h2>
            <p className="text-gray-700 text-sm mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">1. Information We Collect</h3>
            <p className="text-gray-700 mb-4">
              At Hygge, we collect information that you provide directly to us, such as when you create an account, 
              participate in community features, or contact us for support. This includes your email address, profile information, 
              and activity data related to your meditation, yoga, and reading practices.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">2. How We Use Your Information</h3>
            <p className="text-gray-700 mb-4">
              We use the information we collect to provide, maintain, and improve our services. This includes tracking your 
              progress, personalizing your experience, enabling community features, and providing customer support. 
              We may also use your information to communicate with you about updates and new features.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">3. Information Sharing</h3>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
              except as described in this policy. We may share information in aggregated, anonymized form for research 
              and analytics purposes. We may also share information if required by law or to protect our rights.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">4. Data Security</h3>
            <p className="text-gray-700 mb-4">
              We implement appropriate security measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic 
              storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">5. Your Rights</h3>
            <p className="text-gray-700 mb-4">
              You have the right to access, update, or delete your personal information. You can also opt out of certain 
              communications from us. To exercise these rights, please contact us using the information provided in our 
              Help & Support section.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">6. Children's Privacy</h3>
            <p className="text-gray-700 mb-4">
              Hygge is not intended for children under the age of 13. We do not knowingly collect personal information 
              from children under 13. If we become aware that we have collected such information, we will take steps to delete it.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">7. Changes to This Policy</h3>
            <p className="text-gray-700 mb-4">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new 
              policy on this page and updating the "Last updated" date. Your continued use of our services after any changes 
              constitutes acceptance of the new policy.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">8. Contact Us</h3>
            <p className="text-gray-700">
              If you have any questions about this privacy policy or our data practices, please contact us at 
              <span className="font-medium"> hyggeetbr@gmail.com</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
