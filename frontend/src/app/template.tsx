import styles from './styles.module.css';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen flex flex-col overflow-auto">
      <header className="w-full p-3 border-b bg-white flex">
        <h1
          className="font-semibold text-xl bg-clip-text bg-gradient-45 
          from-purple-500 to-rose-500 text-transparent"
        >
          Conversor
        </h1>
      </header>
      <section className="flex-1 flex">
        <section
          className={`${styles["main-background"]} flex flex-col flex-1 p-4`}
        >
          {children}
        </section>
      </section>
    </div>
  );
}
