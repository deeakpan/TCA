export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Privacy Policy</h1>
        <div className="prose prose-invert space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-4">1. Information Collection</h2>
            <p>We collect information necessary to provide our cosmic DNA profiling services.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-4">2. Use of Information</h2>
            <p>Your information is used to generate and maintain your cosmic DNA profile.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-4">3. Data Security</h2>
            <p>We implement appropriate security measures to protect your information.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-4">4. Third-Party Services</h2>
            <p>We use SpaceComputer's cTRNG technology for random number generation.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-4">5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-4">6. Contact</h2>
            <p>For privacy concerns, please contact our support team.</p>
          </section>
        </div>
      </div>
    </div>
  );
} 