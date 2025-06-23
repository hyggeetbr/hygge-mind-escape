
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, MessageCircle, Book, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Support = () => {
  const navigate = useNavigate();

  const handleEmailSupport = () => {
    window.location.href = "mailto:hyggeetbr@gmail.com?subject=Hygge App Support";
  };

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
        <h1 className="text-black text-xl font-medium">Help & Support</h1>
        <div className="w-10"></div> {/* Spacer for center alignment */}
      </div>

      {/* Content */}
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-black mb-4">We're Here to Help</h2>
            <p className="text-gray-700 text-lg">
              Get the support you need to make the most of your Hygge experience
            </p>
          </div>

          {/* Contact Support */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Mail className="w-6 h-6 text-calm-purple mr-3" />
              <h3 className="text-xl font-semibold text-black">Contact Support</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Need help with your account, have a question about a feature, or experiencing technical issues? 
              Our support team is ready to assist you.
            </p>
            <Button 
              onClick={handleEmailSupport}
              className="bg-calm-purple hover:bg-calm-purple/90 text-white"
            >
              Email Us: hyggeetbr@gmail.com
            </Button>
          </div>

          {/* FAQ Section */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-6">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-black mb-2">How do I track my daily progress?</h4>
                <p className="text-gray-700">
                  Your meditation, yoga, and reading minutes are automatically tracked as you complete activities. 
                  View your progress on your profile page under "Your Journey".
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-black mb-2">How do I earn achievements?</h4>
                <p className="text-gray-700">
                  Build consistent daily streaks in meditation, yoga, and reading to unlock achievements. 
                  The more consistent you are, the more achievements you'll earn!
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-black mb-2">Can I connect with other users?</h4>
                <p className="text-gray-700">
                  Yes! Visit the Community section to share your journey, read posts from other users, 
                  and get inspired by the Hygge community.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-black mb-2">Is my data secure?</h4>
                <p className="text-gray-700">
                  Absolutely. We take your privacy seriously and implement industry-standard security measures 
                  to protect your personal information. Read our Privacy Policy for more details.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-6">Additional Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Book className="w-8 h-8 text-calm-orange mr-4" />
                <div>
                  <h4 className="font-semibold text-black">Getting Started Guide</h4>
                  <p className="text-gray-600 text-sm">Learn how to make the most of Hygge</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Users className="w-8 h-8 text-calm-blue mr-4" />
                <div>
                  <h4 className="font-semibold text-black">Community Guidelines</h4>
                  <p className="text-gray-600 text-sm">How to engage respectfully with others</p>
                </div>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <MessageCircle className="w-5 h-5 text-blue-600 mr-2" />
              <h4 className="font-semibold text-black">Response Time</h4>
            </div>
            <p className="text-gray-700 text-sm">
              We typically respond to support requests within 24-48 hours. For urgent issues, 
              please mention "URGENT" in your email subject line.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
