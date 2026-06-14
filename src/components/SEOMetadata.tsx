import { Helmet } from "react-helmet-async";
import { Book } from "../types";

interface SEOMetadataProps {
  currentPage: string;
  selectedBook: Book | null;
}

export default function SEOMetadata({ currentPage, selectedBook }: SEOMetadataProps) {
  // Determine title & meta values based on page state
  let title = "BookVerse | Premium Handbound Book Library & Literary Sanctuary";
  let desc = "Explore BookVerse, the premium library sanctuary. Discover high-quality, physical handbound gold-edition volumes of philosophy, literature, science fiction, and economics.";
  let ogType = "website";
  let ogImage = "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=600"; // Elegant default library background

  if (currentPage === "home") {
    title = "BookVerse | Handbound Book Library";
    desc = "Welcome to BookVerse, the ultimate bibliophile sanctuary. Engage with dynamic reading schedules, curate your favorites shelf, and utilize our smart Gemini AI literary concierge.";
  } else if (currentPage === "explore") {
    title = "BookVerse | Explore";
    desc = "Browse our meticulously curated gold-edition collections of philosophy, classic literature, science fiction, and economic manuals. Add premium bound books to your cart.";
  } else if (currentPage === "detail" && selectedBook) {
    title = `BookVerse | ${selectedBook.title}`;
    desc = `${selectedBook.description.slice(0, 160)}... Explore this premium volume inside the BookVerse literary library. Category: ${selectedBook.category}. Price: ₹${selectedBook.price.toFixed(2)}.`;
    ogType = "book";
    if (selectedBook.coverUrl) {
      ogImage = selectedBook.coverUrl;
    }
  } else if (currentPage === "wishlist") {
    title = "BookVerse | Wishlist";
    desc = "Your bespoke literary archive. Keep track of handbound volumes and modern classics you resolve to add to your permanent home libraries in the near future.";
  } else if (currentPage === "cart") {
    title = "BookVerse | Cart";
    desc = "Review your highly curated selections of handwired, gold-leaf-stamped manuscripts prepared for physical binding and express courier delivery.";
  } else if (currentPage === "checkout") {
    title = "BookVerse | Checkout";
    desc = "Acquire your books with our secure 256-bit encrypted checkout gateway. Finish your academic scholarship order safely inside our security perimeter.";
  } else if (currentPage === "dashboard") {
    title = "BookVerse | Dashboard";
    desc = "Track your daily reading targets, maintain robust reading streaks, query our server-side Gemini AI concierge, and organize your academic progress timelines.";
  } else if (currentPage === "profile") {
    title = "BookVerse | Profile";
    desc = "Celebrate your academic accomplishments, gold scholarship status, verified read counts, and unlocked achievements inside the BookVerse fellowship.";
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": currentPage === "detail" && selectedBook ? "Book" : "WebSite",
    "name": title,
    "description": desc,
    "url": typeof window !== "undefined" ? window.location.href : "https://bookverse.sandbox",
    ...(currentPage === "detail" && selectedBook ? {
      "author": {
        "@type": "Person",
        "name": selectedBook.author
      },
      "image": selectedBook.coverUrl,
      "isbn": "978-3-16-148410-0",
      "offers": {
        "@type": "Offer",
        "price": selectedBook.price,
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock"
      },
      "genre": selectedBook.category
    } : {})
  };

  return (
    <Helmet>
      {/* Standard HTML Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={desc} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={typeof window !== "undefined" ? window.location.href : "https://bookverse.sandbox"} />
      <meta property="og:site_name" content="BookVerse Sanctuary" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
