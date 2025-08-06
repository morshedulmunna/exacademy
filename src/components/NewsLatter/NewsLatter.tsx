import React from "react";
import { Button } from "../ui/button";

type Props = {};

export default function NewsLatter({}: Props) {
  return (
    <div>
      <div className="mt-16 bg-gradient-to-r from-secondary to-muted dark:from-secondary dark:to-muted rounded-xl p-8 text-center border border-border">
        <h3 className="text-2xl font-bold mb-4 text-foreground">Stay Updated</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">Get the latest blog posts and tutorials delivered directly to your inbox. No spam, unsubscribe anytime.</p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="email" placeholder="Enter your email" className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">Subscribe</Button>
        </div>
        <p className="text-muted-foreground text-xs mt-3">Join 2,500+ developers who are already subscribed.</p>
      </div>

      {/* Mobile View All Button */}
      <div className="flex justify-center mt-8 md:hidden">
        <Button variant="outline">View All Posts</Button>
      </div>
    </div>
  );
}
