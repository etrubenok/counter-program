import Image from "next/image";
import WalletContextProvider from "@/app/ui/wallet-context-provider";
import {AppBar} from "@/app/ui/app-bar";
import styles from "@/styles/AppBar.module.css";

export default function Home() {
  return (
      <WalletContextProvider>
          <div className={styles.App}>
            <AppBar />
            <div className={styles.AppBody}>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
              <p>Main content</p>
            </div>
            <footer className="flex gap-[24px] flex-wrap items-center justify-center">
              <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  aria-hidden
                  src="/file.svg"
                  alt="File icon"
                  width={16}
                  height={16}
                />
                Learn
              </a>
              <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  aria-hidden
                  src="/window.svg"
                  alt="Window icon"
                  width={16}
                  height={16}
                />
                Examples
              </a>
              <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  aria-hidden
                  src="/globe.svg"
                  alt="Globe icon"
                  width={16}
                  height={16}
                />
                Go to nextjs.org →
              </a>
            </footer>
          </div>
      </WalletContextProvider>
  );
}
