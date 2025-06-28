import nodemailer from "nodemailer";
import config from "./config";

const transporter = nodemailer.createTransport({
  host: config.email.smtp.host,
  port: config.email.smtp.port,
  secure: config.email.smtp.secure,
  auth: {
    user: config.email.smtp.auth.user,
    pass: config.email.smtp.auth.pass,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: config.email.from,
      to,
      subject,
      html,
    });

    console.log(`[EMAIL] Gönderildi: ${info.messageId} (To: ${to})`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`[EMAIL] Gönderim Hatası (To: ${to}):`, error.message || error);
    return { success: false, error: error.message || "Bilinmeyen hata" };
  }
}

export async function sendVerificationEmail(email: string, userId: string) {
  const verificationLink = `${config.app.url}/verify-email?token=${userId}`;

  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #444;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">RezerveEt'e Hoş Geldiniz!</h1>
      </div>
      <div style="padding: 40px 20px; background: white;">
        <h2 style="margin-bottom: 20px;">E-posta Adresinizi Doğrulayın</h2>
        <p style="line-height: 1.6; margin-bottom: 30px;">
          Hesabınızı aktifleştirmek için aşağıdaki butona tıklayarak e-posta adresinizi doğrulayın.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" 
             style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            E-postamı Doğrula
          </a>
        </div>
        <p style="font-size: 14px; color: #999; margin-top: 30px;">
          Bu e-postayı siz talep etmediyseniz, güvenle göz ardı edebilirsiniz.
        </p>
      </div>
      <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666;">
        <p>© 2024 RezerveEt. Tüm hakları saklıdır.</p>
      </div>
    </div>
  `;

  return sendEmail(email, "E-posta Adresinizi Doğrulayın - RezerveEt", html);
}

export async function sendReservationConfirmation(email: string, reservation: any) {
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #444;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Rezervasyon Onayı</h1>
      </div>
      <div style="padding: 40px 20px; background: white;">
        <h2 style="margin-bottom: 20px;">Rezervasyonunuz Onaylandı! 🎉</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Rezervasyon Detayları</h3>
          <table style="width: 100%; border-collapse: collapse; color: #666;">
            <tr><td style="padding: 8px 0;">Rezervasyon No:</td><td style="padding: 8px 0; font-weight: bold;">${reservation.confirmationCode}</td></tr>
            <tr><td style="padding: 8px 0;">İşletme:</td><td style="padding: 8px 0; font-weight: bold;">${reservation.businessName}</td></tr>
            <tr><td style="padding: 8px 0;">Hizmet:</td><td style="padding: 8px 0; font-weight: bold;">${reservation.serviceName}</td></tr>
            <tr><td style="padding: 8px 0;">Tarih:</td><td style="padding: 8px 0; font-weight: bold;">${new Date(reservation.date).toLocaleDateString("tr-TR")}</td></tr>
            <tr><td style="padding: 8px 0;">Saat:</td><td style="padding: 8px 0; font-weight: bold;">${reservation.time}</td></tr>
            <tr><td style="padding: 8px 0;">Kişi Sayısı:</td><td style="padding: 8px 0; font-weight: bold;">${reservation.guests} kişi</td></tr>
            <tr><td style="padding: 8px 0;">Toplam Tutar:</td><td style="padding: 8px 0; font-weight: bold; color: #667eea;">₺${reservation.price}</td></tr>
          </table>
        </div>
        <p style="line-height: 1.6;">
          Rezervasyonunuz için teşekkür ederiz. Randevu saatinizden 1 saat önce size hatırlatma mesajı göndereceğiz.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <p style="margin-bottom: 15px;">İşletme ile iletişim:</p>
          <p style="font-weight: bold;">${reservation.businessPhone}</p>
        </div>
      </div>
      <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666;">
        <p>© 2024 RezerveEt. Tüm hakları saklıdır.</p>
      </div>
    </div>
  `;

  return sendEmail(email, `Rezervasyon Onayı - ${reservation.businessName}`, html);
}

export async function sendReservationReminder(email: string, reservation: any) {
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #444;">
      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Rezervasyon Hatırlatması ⏰</h1>
      </div>
      <div style="padding: 40px 20px; background: white;">
        <h2 style="margin-bottom: 20px;">Rezervasyonunuz Yaklaşıyor!</h2>
        <p style="line-height: 1.6; margin-bottom: 30px;">
          ${reservation.businessName} işletmesindeki rezervasyonunuz 1 saat sonra başlayacak.
        </p>
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0; color: #856404;">
          <h3 style="margin-top: 0;">Rezervasyon Detayları</h3>
          <p><strong>Tarih:</strong> ${new Date(reservation.date).toLocaleDateString("tr-TR")}</p>
          <p><strong>Saat:</strong> ${reservation.time}</p>
          <p><strong>Hizmet:</strong> ${reservation.serviceName}</p>
          <p><strong>Kişi Sayısı:</strong> ${reservation.guests} kişi</p>
        </div>
        <p style="line-height: 1.6;">
          Lütfen randevu saatinizde hazır olun. Geç kalmanız durumunda işletme ile iletişime geçin.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <p style="margin-bottom: 15px;">İşletme Telefonu:</p>
          <p style="font-weight: bold; font-size: 18px;">${reservation.businessPhone}</p>
        </div>
      </div>
      <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666;">
        <p>© 2024 RezerveEt. Tüm hakları saklıdır.</p>
      </div>
    </div>
  `;

  return sendEmail(email, `Rezervasyon Hatırlatması - ${reservation.businessName}`, html);
}

export async function sendBusinessApprovalEmail(email: string, businessName: string) {
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #444;">
      <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Tebrikler! 🎉</h1>
      </div>
      <div style="padding: 40px 20px; background: white;">
        <h2 style="margin-bottom: 20px;">İşletmeniz Onaylandı!</h2>
        <p style="line-height: 1.6; margin-bottom: 30px;">
          <strong>${businessName}</strong> işletmenizin RezerveEt platformuna katılım başvurusu onaylanmıştır.
        </p>
        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0; color: #155724;">
          <h3 style="margin-top: 0;">Artık Yapabilecekleriniz:</h3>
          <ul style="margin: 10px 0 0 20px; padding: 0;">
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
        <p style="line-height: 1.6;">
          Herhangi bir sorunuz olursa bizimle iletişime geçmekten çekinmeyin.
        </p>
      </div>
      <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666;">
        <p>© 2024 RezerveEt. Tüm hakları saklıdır.</p>
      </div>
    </div>
  `;

  return sendEmail(email, `İşletmeniz Onaylandı - ${businessName}`, html);
}

export async function sendBusinessRejectionEmail(email: string, businessName: string, reason: string) {
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #444;">
      <div style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Başvuru Durumu</h1>
      </div>
      <div style="padding: 40px 20px; background: white;">
        <h2 style="margin-bottom: 20px;">İşletme Başvurunuz Hakkında</h2>
        <p style="line-height: 1.6; margin-bottom: 30px;">
          <strong>${businessName}</strong> işletmenizin RezerveEt platformuna katılım başvurusu maalesef onaylanamamıştır.
        </p>
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; margin: 20px 0; color: #721c24;">
          <h3 style="margin-top: 0;">Red Sebebi:</h3>
          <p>${reason}</p>
        </div>
        <p style="line-height: 1.6;">
          Eksiklikleri giderdikten sonra tekrar başvuru yapabilirsiniz. Sorularınız için bizimle iletişime geçebilirsiniz.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${config.app.url}/business/register" 
             style="background: #6c757d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Yeniden Başvur
          </a>
        </div>
      </div>
      <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666;">
        <p>© 2024 RezerveEt. Tüm hakları saklıdır.</p>
      </div>
    </div>
  `;

  return sendEmail(email, `Başvuru Durumu - ${businessName}`, html);
}
