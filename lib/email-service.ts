import nodemailer from "nodemailer"
import { config } from "./config"

// SMTP transporter oluştur
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
})

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: config.email.from,
      to,
      subject,
      html,
    })

    console.log("Email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Email send error:", error)
    return { success: false, error: error.message }
  }
}

export async function sendVerificationEmail(email: string, userId: string) {
  const verificationLink = `${config.app.url}/verify-email?token=${userId}`

  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">RezerveEt'e Hoş Geldiniz!</h1>
      </div>
      
      <div style="padding: 40px 20px; background: white;">
        <h2 style="color: #333; margin-bottom: 20px;">E-posta Adresinizi Doğrulayın</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
          Hesabınızı aktifleştirmek için aşağıdaki butona tıklayarak e-posta adresinizi doğrulayın.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" 
             style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            E-postamı Doğrula
          </a>
        </div>
        
        <p style="color: #999; font-size: 14px; margin-top: 30px;">
          Bu e-postayı siz talep etmediyseniz, güvenle göz ardı edebilirsiniz.
        </p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
        <p>© 2024 RezerveEt. Tüm hakları saklıdır.</p>
      </div>
    </div>
  `

  return sendEmail(email, "E-posta Adresinizi Doğrulayın - RezerveEt", html)
}

export async function sendReservationConfirmation(email: string, reservation: any) {
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Rezervasyon Onayı</h1>
      </div>
      
      <div style="padding: 40px 20px; background: white;">
        <h2 style="color: #333; margin-bottom: 20px;">Rezervasyonunuz Onaylandı! 🎉</h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Rezervasyon Detayları</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666;">Rezervasyon No:</td>
              <td style="padding: 8px 0; font-weight: bold;">${reservation.confirmationCode}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">İşletme:</td>
              <td style="padding: 8px 0; font-weight: bold;">${reservation.businessName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Hizmet:</td>
              <td style="padding: 8px 0; font-weight: bold;">${reservation.serviceName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Tarih:</td>
              <td style="padding: 8px 0; font-weight: bold;">${new Date(reservation.date).toLocaleDateString("tr-TR")}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Saat:</td>
              <td style="padding: 8px 0; font-weight: bold;">${reservation.time}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Kişi Sayısı:</td>
              <td style="padding: 8px 0; font-weight: bold;">${reservation.guests} kişi</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Toplam Tutar:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #667eea;">₺${reservation.price}</td>
            </tr>
          </table>
        </div>
        
        <p style="color: #666; line-height: 1.6;">
          Rezervasyonunuz için teşekkür ederiz. Randevu saatinizden 1 saat önce size hatırlatma mesajı göndereceğiz.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #666; margin-bottom: 15px;">İşletme ile iletişim:</p>
          <p style="color: #333; font-weight: bold;">${reservation.businessPhone}</p>
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
        <p>© 2024 RezerveEt. Tüm hakları saklıdır.</p>
      </div>
    </div>
  `

  return sendEmail(email, `Rezervasyon Onayı - ${reservation.businessName}`, html)
}

export async function sendReservationReminder(email: string, reservation: any) {
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Rezervasyon Hatırlatması ⏰</h1>
      </div>
      
      <div style="padding: 40px 20px; background: white;">
        <h2 style="color: #333; margin-bottom: 20px;">Rezervasyonunuz Yaklaşıyor!</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
          ${reservation.businessName} işletmesindeki rezervasyonunuz 1 saat sonra başlayacak.
        </p>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #856404; margin-top: 0;">Rezervasyon Detayları</h3>
          <p style="margin: 5px 0; color: #856404;"><strong>Tarih:</strong> ${new Date(reservation.date).toLocaleDateString("tr-TR")}</p>
          <p style="margin: 5px 0; color: #856404;"><strong>Saat:</strong> ${reservation.time}</p>
          <p style="margin: 5px 0; color: #856404;"><strong>Hizmet:</strong> ${reservation.serviceName}</p>
          <p style="margin: 5px 0; color: #856404;"><strong>Kişi Sayısı:</strong> ${reservation.guests} kişi</p>
        </div>
        
        <p style="color: #666; line-height: 1.6;">
          Lütfen randevu saatinizde hazır olun. Geç kalmanız durumunda işletme ile iletişime geçin.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #666; margin-bottom: 15px;">İşletme Telefonu:</p>
          <p style="color: #333; font-weight: bold; font-size: 18px;">${reservation.businessPhone}</p>
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
        <p>© 2024 RezerveEt. Tüm hakları saklıdır.</p>
      </div>
    </div>
  `

  return sendEmail(email, `Rezervasyon Hatırlatması - ${reservation.businessName}`, html)
}

export async function sendBusinessApprovalEmail(email: string, businessName: string) {
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Tebrikler! 🎉</h1>
      </div>
      
      <div style="padding: 40px 20px; background: white;">
        <h2 style="color: #333; margin-bottom: 20px;">İşletmeniz Onaylandı!</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
          <strong>${businessName}</strong> işletmenizin RezerveEt platformuna katılım başvurusu onaylanmıştır.
        </p>
        
        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #155724; margin-top: 0;">Artık Yapabilecekleriniz:</h3>
          <ul style="color: #155724; margin: 10px 0; padding-left: 20px;">
            <li>İşletme profilinizi düzenleyebilirsiniz</li>
            <li>Hizmetlerinizi ekleyip yönetebilirsiniz</li>
            <li>Rezervasyonları kabul etmeye başlayabilirsiniz</li>
            <li>Müşterilerinizle iletişim kurabilirsiniz</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${config.app.url}/dashboard/business" 
             style="background: #4facfe; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            İşletme Paneline Git
          </a>
        </div>
        
        <p style="color: #666; line-height: 1.6;">
          Herhangi bir sorunuz olursa bizimle iletişime geçmekten çekinmeyin.
        </p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
        <p>© 2024 RezerveEt. Tüm hakları saklıdır.</p>
      </div>
    </div>
  `

  return sendEmail(email, `İşletmeniz Onaylandı - ${businessName}`, html)
}

export async function sendBusinessRejectionEmail(email: string, businessName: string, reason: string) {
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <div style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Başvuru Durumu</h1>
      </div>
      
      <div style="padding: 40px 20px; background: white;">
        <h2 style="color: #333; margin-bottom: 20px;">İşletme Başvurunuz Hakkında</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
          <strong>${businessName}</strong> işletmenizin RezerveEt platformuna katılım başvurusu maalesef onaylanamamıştır.
        </p>
        
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #721c24; margin-top: 0;">Red Sebebi:</h3>
          <p style="color: #721c24; margin: 10px 0;">${reason}</p>
        </div>
        
        <p style="color: #666; line-height: 1.6;">
          Eksiklikleri giderdikten sonra tekrar başvuru yapabilirsiniz. Sorularınız için bizimle iletişime geçebilirsiniz.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${config.app.url}/business/register" 
             style="background: #6c757d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Yeniden Başvur
          </a>
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
        <p>© 2024 RezerveEt. Tüm hakları saklıdır.</p>
      </div>
    </div>
  `

  return sendEmail(email, `Başvuru Durumu - ${businessName}`, html)
}
