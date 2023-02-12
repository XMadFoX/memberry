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
        <h1>Email sent</h1>
        <p>Check your email to verify email</p>
        <small>Link is valid within 5 minutes.</small>
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
