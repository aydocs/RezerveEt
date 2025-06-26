"use client"

import { motion } from "framer-motion"
import { Users, Target, Award, Heart, Sparkles, TrendingUp, Shield, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

const stats = [
  { number: "25,000+", label: "Mutlu Kullanıcı", icon: Users },
  { number: "3,200+", label: "Kayıtlı İşletme", icon: Target },
  { number: "500,000+", label: "Tamamlanan Rezervasyon", icon: Award },
  { number: "4.9/5", label: "Kullanıcı Memnuniyeti", icon: Star },
]

const values = [
  {
    icon: Heart,
    title: "Müşteri Odaklılık",
    description: "Her zaman müşterilerimizin ihtiyaçlarını ön planda tutuyoruz.",
  },
  {
    icon: Shield,
    title: "Güvenilirlik",
    description: "Verilerinizin güvenliği ve gizliliği bizim için önceliktir.",
  },
  {
    icon: TrendingUp,
    title: "İnovasyon",
    description: "Sürekli gelişim ve yenilikçi çözümlerle sektöre öncülük ediyoruz.",
  },
  {
    icon: Clock,
    title: "Hızlı Hizmet",
    description: "Zamanınızın değerli olduğunu biliyoruz ve hızlı çözümler sunuyoruz.",
  },
]

const team = [
  {
    name: "Ahmet Yılmaz",
    role: "Kurucu & CEO",
    image: "/placeholder.svg?height=300&width=300",
    description: "10+ yıl teknoloji sektörü deneyimi",
  },
  {
    name: "Elif Kaya",
    role: "CTO",
    image: "/placeholder.svg?height=300&width=300",
    description: "Yazılım geliştirme uzmanı",
  },
  {
    name: "Mehmet Özkan",
    role: "İş Geliştirme Müdürü",
    image: "/placeholder.svg?height=300&width=300",
    description: "Stratejik ortaklıklar ve büyüme",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RezerveEt
              </h1>
              <Sparkles className="h-5 w-5 text-yellow-500 ml-1" />
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/search" className="text-gray-700 hover:text-blue-600 transition-colors">
                İşletmeler
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                İletişim
              </Link>
              <Button variant="outline" asChild>
                <Link href="/login">Giriş Yap</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Üye Ol</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Hakkımızda</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Türkiye'nin en güvenilir online rezervasyon platformu olarak, işletmeler ve müşteriler arasında köprü
              kuruyoruz.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Hikayemiz</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  RezerveEt, 2023 yılında Türkiye'deki rezervasyon süreçlerini dijitalleştirmek ve hem işletmelerin hem
                  de müşterilerin hayatını kolaylaştırmak amacıyla kuruldu.
                </p>
                <p>
                  Kurucu ekibimiz, yıllarca farklı sektörlerde yaşanan rezervasyon zorluklarını gözlemledi ve bu
                  sorunlara teknolojik çözümler geliştirme kararı aldı.
                </p>
                <p>
                  Bugün, binlerce işletme ve yüz binlerce kullanıcıyla Türkiye'nin en büyük rezervasyon platformlarından
                  biri haline geldik.
                </p>
              </div>
              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href="/contact">Bizimle İletişime Geçin</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="RezerveEt Ekibi"
                width={600}
                height={500}
                className="rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Misyon & Vizyon</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Geleceğin rezervasyon deneyimini bugünden yaşatıyoruz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Misyonumuz</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Türkiye'deki tüm hizmet sektörlerinde rezervasyon süreçlerini dijitalleştirerek, işletmelerin
                    verimliliğini artırmak ve müşterilerin zamanını değerli kılmak. Teknoloji ile insan deneyimini
                    harmanlayarak, herkes için daha iyi bir gelecek inşa etmek.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Vizyonumuz</h3>
                  <p className="text-gray-700 leading-relaxed">
                    2030 yılına kadar Türkiye'nin en büyük ve en güvenilir rezervasyon platformu olmak. Yapay zeka ve
                    makine öğrenmesi teknolojileriyle kişiselleştirilmiş deneyimler sunarak, rezervasyon kavramını
                    yeniden tanımlamak.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Değerlerimiz</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Çalışma kültürümüzü şekillendiren temel değerler</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ekibimiz</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              RezerveEt'i hayata geçiren deneyimli ve tutkulu ekibimiz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={200}
                      height={200}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Bizimle Büyümeye Hazır mısınız?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              RezerveEt ailesine katılın ve rezervasyon deneyiminizi bir üst seviyeye taşıyın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link href="/register">
                  <Users className="h-5 w-5 mr-2" />
                  Ücretsiz Üye Ol
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
                asChild
              >
                <Link href="/business/register">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  İşletme Kaydı
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  RezerveEt
                </h3>
                <Sparkles className="h-5 w-5 text-yellow-400 ml-1" />
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Türkiye'nin en güvenilir ve gelişmiş online rezervasyon platformu. Milyonlarca kullanıcının tercihi.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Hızlı Linkler</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-white transition-colors">
                    İşletmeler
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    İletişim
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Destek</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Yardım Merkezi
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Kullanım Şartları
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Gizlilik Politikası
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Kariyer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RezerveEt.com. Tüm hakları saklıdır. Made with ❤️ in Turkey</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
