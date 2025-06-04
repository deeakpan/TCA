export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Terms of Use</h1>
        <div className="prose prose-invert space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using Cosmic Nexus, you agree to be bound by these Terms of Use.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-4">2. Description of Service</h2>
            <p>Cosmic Nexus provides cosmic DNA profiling and random number generation services powered by space-based technology.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-4">3. User Responsibilities</h2>
            <p>Users must provide accurate information and use the service in accordance with applicable laws.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-4">4. Intellectual Property</h2>
            <p>All content and technology associated with Cosmic Nexus is protected by copyright and other intellectual property laws.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-4">5. Limitation of Liability</h2>
            <p>Cosmic Nexus is provided "as is" without any warranties of any kind.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-4">6. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time.</p>
          </section>
        </div>
      </div>
    </div>
  );
} 