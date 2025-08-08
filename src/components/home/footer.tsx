import Link from "next/link";

export const Footer = () => {
  const navigationItems = [
    {
      title: "Home",
      href: "/",
      description: "",
    },
    {
      title: "Solutions",
      description: "Comprehensive financial intelligence platform",
      items: [
        {
          title: "Company Reports",
          href: "/reports",
        },
        {
          title: "Market Trends",
          href: "/trends",
        },
        {
          title: "Pricing Analysis",
          href: "/pricing",
        },
        {
          title: "API Access",
          href: "/api",
        },
      ],
    },
    {
      title: "Company",
      description: "Driving financial transparency through data",
      items: [
        {
          title: "About Us",
          href: "/about",
        },
        {
          title: "Careers",
          href: "/careers",
        },
        {
          title: "Data Sources",
          href: "/sources",
        },
        {
          title: "Contact Sales",
          href: "/contact",
        },
      ],
    },
  ];

  return (
    <div className="w-full py-10 lg:py-20 bg-foreground text-background">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="flex gap-8 flex-col items-start">
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                FinInsight<span className="text-primary">AI</span>
              </h2>
              <p className="text-lg max-w-lg leading-relaxed tracking-tight text-background/75 text-left">
                Comprehensive financial intelligence for data-driven decisions
              </p>
            </div>
            <div className="flex gap-20 flex-row">
              <div className="flex flex-col text-sm max-w-lg leading-relaxed tracking-tight text-background/75 text-left">
                <p>200 Financial District</p>
                <p>San Francisco</p>
                <p>CA 94111</p>
              </div>
              <div className="flex flex-col text-sm max-w-lg leading-relaxed tracking-tight text-background/75 text-left gap-1">
                <Link href="/terms">Terms of Service</Link>
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/security">Security</Link>
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            {navigationItems.map((item) => (
              <div
                key={item.title}
                className="flex text-base gap-1 flex-col items-start"
              >
                <div className="flex flex-col gap-2">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex justify-between items-center"
                    >
                      <span className="text-xl">{item.title}</span>
                    </Link>
                  ) : (
                    <p className="text-xl">{item.title}</p>
                  )}
                  {item.items &&
                    item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className="flex justify-between items-center hover:text-background/90 transition-colors"
                      >
                        <span className="text-background/75">
                          {subItem.title}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
