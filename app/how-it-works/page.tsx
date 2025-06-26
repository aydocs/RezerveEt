import { CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      title: "Adım 1: İşletmeyi Seç",
      description: "Beğendiğin kategoriden işletmeyi seç ve detaylarına göz at.",
    },
    {
      title: "Adım 2: Rezervasyon Yap",
      description: "Uygun tarihi seç ve kolayca rezervasyonunu oluştur.",
    },
    {
      title: "Adım 3: Onayını Al",
      description: "İşletmeden onay mesajını al, hazırlıklarına başla.",
    },
    {
      title: "Adım 4: Hizmetin Keyfini Çıkar",
      description: "Belirttiğin zamanda işletmeye git ve hizmetin tadını çıkar!",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-6 sm:px-12 lg:px-24">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-12">
        Nasıl Çalışır?
      </h1>

      <div className="max-w-4xl mx-auto grid gap-12 sm:grid-cols-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-start bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <CheckCircle className="h-10 w-10 text-blue-600 mb-4" />
            <h2 className="text-xl font-bold mb-2">{step.title}</h2>
            <p className="text-gray-700">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
