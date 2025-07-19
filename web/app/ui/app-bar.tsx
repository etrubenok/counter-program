"use client";

import { FC } from "react";
import dynamic from "next/dynamic";
import styles from "@/styles/AppBar.module.css";

const WalletMultiButtonDynamic = dynamic(
    async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
);

export const AppBar: FC = () => {
    return (
        <div className={styles.AppHeader}>
            {/*<Image src="/solanaLogo.png" height={30} width={200} />*/}
            <span>Wallet-Adapter Example</span>
            <WalletMultiButtonDynamic />
        </div>
    );
};