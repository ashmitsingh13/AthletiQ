
"use client";
import CameraPose from "@/components/CameraPose";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, BarChart3 } from "lucide-react";

export default function RealtimeAnalysisPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border-0 bg-primary/5">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Real-Time Analysis</h3>
              <p className="text-xs text-muted-foreground">Live feedback as you exercise</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-secondary/5">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-secondary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Private & Secure</h3>
              <p className="text-xs text-muted-foreground">Camera data is never stored</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-accent/5">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-8 h-8 text-accent mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Instant Insights</h3>
              <p className="text-xs text-muted-foreground">See your reps and progress instantly</p>
            </CardContent>
          </Card>
        </div>

        {/* Camera Analysis Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Real-Time Exercise Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <CameraPose />
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="bg-muted/30 mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Tips for Best Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">1</Badge>
              <div>
                <p className="font-medium text-sm">Good Lighting</p>
                <p className="text-xs text-muted-foreground">Make sure your room is well-lit</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">2</Badge>
              <div>
                <p className="font-medium text-sm">Full Body Visible</p>
                <p className="text-xs text-muted-foreground">Keep your whole body in the camera frame</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">3</Badge>
              <div>
                <p className="font-medium text-sm">Stable Camera</p>
                <p className="text-xs text-muted-foreground">Use a tripod or stable surface</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">4</Badge>
              <div>
                <p className="font-medium text-sm">Side View</p>
                <p className="text-xs text-muted-foreground">Side angle helps with form analysis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}