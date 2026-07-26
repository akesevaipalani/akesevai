import TokenPass from '../components/TokenPass';

export const pageMeta = { id: 'token-generator', title: 'Token Slip' };

export default function TokenGeneratorPage({ onTokenSaved }) {
  return (
    <section className="page-width inner-page">
      <TokenPass onTokenSaved={onTokenSaved} />
    </section>
  );
}
