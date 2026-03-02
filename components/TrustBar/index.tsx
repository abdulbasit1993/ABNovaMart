import React from "react";

const TrustBar = () => {
  const features = [
    {
      title: "Fast Shipping",
      description: "Shipped In 1-3 Days",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-700"
        >
          <path d="M10 17h4" />
          <path d="M2 10h3" />
          <path d="M2 14h5" />
          <circle cx="8" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
          <path d="M7 6h8l3 3v9h-2" />
          <path d="M15 18H9" />
          <path d="M2 6h5v12" />
        </svg>
      ),
    },
    {
      title: "Free Returns",
      description: "Free 7 Days Return",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-700"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
          <path d="M12 18V12" />
        </svg>
      ),
    },
    {
      title: "Payment On Delivery",
      description: "Cash On Delivery Option",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-700"
        >
          <rect width="20" height="12" x="2" y="6" rx="2" />
          <circle cx="12" cy="12" r="2" />
          <path d="M6 12h.01M18 12h.01" />
        </svg>
      ),
    },
    {
      title: "Customer Support",
      description: "Phone and Email",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-700"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full bg-white border-y border-gray-100 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 lg:gap-y-0">
          {features.map((item, index) => (
            <div
              key={index}
              className={`flex items-center space-x-5 lg:justify-center 
                ${index !== features.length - 1 ? "lg:border-r border-gray-200" : ""}`}
            >
              <div className="flex-shrink-0 bg-gray-50 p-3 rounded-full">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <h3 className="text-[15px] font-bold text-gray-900 uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
