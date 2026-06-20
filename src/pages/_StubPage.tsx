import styles from './_StubPage.module.css';

type StubPageProps = {
  title?: string;
  description?: string;
};

export function StubPage({
  title = 'Страница',
  description = 'Страница в разработке.',
}: StubPageProps) {
  return (
    <section className={styles.container} aria-labelledby="page-stub-title">
      <div className={styles.label}>Пока что заглушка</div>
      <h1 id="page-stub-title" className={styles.title}>
        {title}
      </h1>
      <p className={styles.text}>{description}</p>
    </section>
  );
}
