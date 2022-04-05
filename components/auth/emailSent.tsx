import Image from 'next/image';

export default function EmailSent() {
  return (
    <div>
      <div
        style={{
          display: 'grid',
          alignItems: 'center',
          justifyItems: 'center',
        }}>
        <h1>Письмо отправлено</h1>
        <p>Проверьте почту для подтверждения регистрации</p>
        <small>Письмо действительно 5 минут.</small>
        <Image
          src="/illustrations/undraw_mail_sent_re_0ofv.svg"
          alt=""
          height={256}
          width={256}
        />
      </div>
    </div>
  );
}
