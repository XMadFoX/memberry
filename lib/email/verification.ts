export default function createEmailBody(token: string): string {
  return `
<div style="border-radius: 0.5rem; background: linear-gradient(45deg, #612676, #B70501, #9F5E04); padding: 2rem">
    <style>
        h1, h2, small {
            user-select: none !important;
            color: #EFEFEF !important;
        }
        .code, a {
            user-select: none !important;
            text-decoration-color: #FDCB0D !important;
            text-decoration: none !important;
            color: #FDCB0D !important;
        }
    </style>
    <h1>Спасибо за регистрацию в MemBerry!</h1>
    <h2>
        Для завершения регистрации перейдите по 
        <strong><a href=${
          process.env['NEXT_PUBLIC_FRONTEND_URL'] + '/api/verify?t=' + token
        } target="_blank">ССЫЛКЕ</a></strong>
    </h2>
    <small style="font-size: 0.75rem; opacity: 0.5">Или вставьте это: ${
      process.env['NEXT_PUBLIC_FRONTEND_URL'] + '/api/verify?t=' + token
    } в строку браузера</small>
    <br/>
    <small style="cursor: not-allowed !important;">
        *Эта ссылка будет действительна в течении 5 минут.
    </small>
    <br/>
    <small style="cursor: not-allowed !important;">
        *Это сообщение было отправлено автоматически и не требует ответа.
    </small>
</div>`;
}
