export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Disclaimer</h1>
        <div className="prose prose-invert space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-4">1. Service Accuracy</h2>
            <p>While we strive for accuracy, cosmic DNA profiling results are for entertainment purposes.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-4">2. No Medical Advice</h2>
            <p>Our services do not provide medical, legal, or financial advice.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-4">3. Third-Party Services</h2>
            <p>We are not responsible for the accuracy of third-party services we integrate with.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-4">4. Service Availability</h2>
            <p>We do not guarantee uninterrupted access to our services.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-4">5. Limitation of Liability</h2>
            <p>We are not liable for any damages arising from the use of our services.</p>
          </section>
        </div>
      </div>
    </div>
  );
} 