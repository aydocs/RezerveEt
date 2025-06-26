"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const faqs = [
  {
    id: 1,
    category: "Hesap",
    question: "Hesabımı nasıl oluştururum?",
    answer: 'Hesap oluşturmak için ana sayfadaki "Kayıt Ol" butonuna tıklayın ve gerekli bilgileri doldurun.',
  },
  {
    id: 2,
    category: "Hesap",
    question: "Şifremi unuttum, ne yapmalıyım?",
    answer: 'Şifrenizi sıfırlamak için "Şifremi Unuttum" bağlantısına tıklayın ve e-posta adresinizi girin.',
  },
  {
    id: 3,
    category: "Ödeme",
    question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
    answer: "Kredi kartı, banka kartı ve PayPal ile ödeme yapabilirsiniz.",
  },
  {
    id: 4,
    category: "Ödeme",
    question: "Ödeme işlemim neden başarısız oldu?",
    answer:
      "Ödeme işleminizin başarısız olmasının birkaç nedeni olabilir. Lütfen kart bilgilerinizin doğru olduğundan ve yeterli bakiyeniz olduğundan emin olun.",
  },
  {
    id: 5,
    category: "Kargo",
    question: "Kargom ne zaman ulaşır?",
    answer: "Kargonuzun tahmini teslimat süresi, siparişinizi verdikten sonra 2-5 iş günüdür.",
  },
  {
    id: 6,
    category: "Kargo",
    question: "Kargomu nasıl takip edebilirim?",
    answer: "Kargonuzu takip etmek için size gönderilen takip numarasını kullanabilirsiniz.",
  },
  {
    id: 7,
    category: "İade",
    question: "İade şartlarınız nelerdir?",
    answer:
      "Ürünleri teslim aldıktan sonra 14 gün içinde iade edebilirsiniz. İade edilecek ürünlerin kullanılmamış ve orijinal ambalajında olması gerekmektedir.",
  },
  {
    id: 8,
    category: "İade",
    question: "İade işlemim ne kadar sürer?",
    answer: "İade işleminiz, ürün bize ulaştıktan sonra 7-10 iş günü içinde tamamlanır.",
  },
]

const AccordionItem = ({ faq, isOpen, toggleAccordion }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        className="flex items-center justify-between w-full py-4 text-left focus:outline-none"
        onClick={toggleAccordion}
      >
        <span className="font-medium">{faq.question}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="py-2"
          >
            <p className="text-gray-700">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Hepsi")
  const [openAccordionId, setOpenAccordionId] = useState(null)

  const categories = ["Hepsi", ...new Set(faqs.map((faq) => faq.category))]

  const filteredFaqs = faqs.filter((faq) => {
    const searchMatch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const categoryMatch = selectedCategory === "Hepsi" || faq.category === selectedCategory
    return searchMatch && categoryMatch
  })

  const toggleAccordion = (id) => {
    setOpenAccordionId(openAccordionId === id ? null : id)
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold mb-6">Sıkça Sorulan Sorular</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Sorunuzu arayın..."
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="category" className="mr-2 font-medium">
          Kategori:
        </label>
        <select
          id="category"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        {filteredFaqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            faq={faq}
            isOpen={openAccordionId === faq.id}
            toggleAccordion={() => toggleAccordion(faq.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default FAQPage
