import Head from 'next/head';

export default function OfflinePage() {
  return (
    <>
      <Head>
        <title>Нет сети</title>
      </Head>
      <h1>Нет сети</h1>
      <h2>Когда Вы не в сети, все не сохраненные страницы ведут сюда</h2>
    </>
  );
}
