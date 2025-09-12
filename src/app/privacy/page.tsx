"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicy() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-background text-foreground relative overflow-hidden py-28 px-6 sm:px-10 lg:px-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl w-full"
      >
        <Card className="rounded-2xl shadow-lg border">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Privacy Policy
            </CardTitle>
            <p className="text-center text-muted-foreground mt-2">
              Last updated: August 24, 2025
            </p>
          </CardHeader>
          <CardContent className="space-y-8 text-base leading-relaxed">
            
            {/* Introduction */}
            <div>
              <h2 className="text-xl font-semibold">1. Introduction</h2>
              <p className="mt-2 text-muted-foreground">
                At <span className="font-medium">AI Fitness Trainer</span>, your privacy is our top priority. 
                This Privacy Policy explains how we collect, use, and safeguard your personal information when 
                you use our platform. By accessing our services, you agree to the terms outlined here.
              </p>
            </div>
            <Separator />

            {/* Information Collection */}
            <div>
              <h2 className="text-xl font-semibold">2. Information We Collect</h2>
              <p className="mt-2 text-muted-foreground">
                We may collect personal details like your name, email address, fitness goals, and activity data. 
                Additionally, we may collect device information such as IP address, browser type, and app usage data 
                to improve user experience.
              </p>
            </div>
            <Separator />

            {/* How We Use Information */}
            <div>
              <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
              <p className="mt-2 text-muted-foreground">
                The collected data helps us to:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Personalize your workout and diet recommendations</li>
                <li>Improve app functionality and performance</li>
                <li>Provide customer support and updates</li>
                <li>Ensure security and prevent fraudulent activity</li>
              </ul>
            </div>
            <Separator />

            {/* Sharing Policy */}
            <div>
              <h2 className="text-xl font-semibold">4. Data Sharing & Disclosure</h2>
              <p className="mt-2 text-muted-foreground">
                We do not sell or rent your personal data. Information may only be shared with trusted third parties 
                for essential services such as payment processing, analytics, or legal compliance.
              </p>
            </div>
            <Separator />

            {/* Security */}
            <div>
              <h2 className="text-xl font-semibold">5. Data Security</h2>
              <p className="mt-2 text-muted-foreground">
                We implement advanced security measures including encryption, secure servers, and restricted access 
                to protect your data. However, please note that no method of transmission over the Internet is 100% secure.
              </p>
            </div>
            <Separator />

            {/* Your Rights */}
            <div>
              <h2 className="text-xl font-semibold">6. Your Rights</h2>
              <p className="mt-2 text-muted-foreground">
                You have the right to access, update, or delete your data at any time. You may also opt out of 
                promotional communications by adjusting your account settings or contacting our support team.
              </p>
            </div>
            <Separator />

            {/* Updates */}
            <div>
              <h2 className="text-xl font-semibold">7. Policy Updates</h2>
              <p className="mt-2 text-muted-foreground">
                We may update this Privacy Policy from time to time. Changes will be posted here, and continued 
                use of our services will signify your acceptance of the updated terms.
              </p>
            </div>
            <Separator />

            {/* Contact */}
            <div>
              <h2 className="text-xl font-semibold">8. Contact Us</h2>
              <p className="mt-2 text-muted-foreground">
                If you have any questions about this Privacy Policy, please reach out to us at{" "}
                <span className="font-medium">support@aifitnesstrainer.com</span>.
              </p>
            </div>

          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
