import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/affiliate-disclosure')({
  head: () => ({
    meta: [
      { title: "Affiliate Disclosure | SpatialFind" },
      { name: "description", content: "Transparency matters. Learn how we monetize SpatialFind through affiliate programs while maintaining editorial integrity." },
    ],
  }),
  component: AffiliateDisclosure,
});

function AffiliateDisclosure() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-3xl">
      <h1 className="text-4xl font-bold tracking-tighter mb-8">Affiliate Disclosure</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <p>
          Welcome to SpatialFind. We believe in being transparent with our audience about how this website operates and earns revenue.
        </p>
        <p>
          SpatialFind is a product discovery and recommendation platform. When you find a product you're interested in and click on a link to view it on a merchant's site (such as Amazon, Flipkart, or others), we may earn a small referral commission for that purchase.
        </p>
        <h2 className="text-2xl font-semibold text-foreground mt-12 mb-4">How it works</h2>
        <p>
          Every "View Deal" or "Check Latest Price" button on our site is an outbound affiliate link. This means if you click that link and subsequently make a purchase, the retailer pays us a small percentage of the sale price at no additional cost to you.
        </p>
        <h2 className="text-2xl font-semibold text-foreground mt-12 mb-4">Our Commitment</h2>
        <p>
          Our editorial team and curators select products based on quality, performance, and value. Our recommendations are not influenced by the affiliate relationship. We prioritize showing you products we believe are truly worth buying.
        </p>
        <p className="bg-muted p-6 rounded-2xl italic border">
          "SpatialFind is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.in and affiliated sites."
        </p>
      </div>
    </div>
  );
}
