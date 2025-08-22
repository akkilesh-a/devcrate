import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
} from "@/components/ui";
import React from "react";

const HomePage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>DevCrate</CardTitle>
          <CardDescription>
            Curated directory of developer tools, UI libraries, and resources
            built with Next.js, Tailwind CSS, and Supabase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Get Started</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
