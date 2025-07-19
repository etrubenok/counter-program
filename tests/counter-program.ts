import * as anchor from "@coral-xyz/anchor";
import {Program} from "@coral-xyz/anchor";
import {CounterProgram} from "../target/types/counter_program";
import {expect} from "chai";

describe("counter-program", () => {
    // Configure the client to use the local cluster.

    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.counterProgram as Program<CounterProgram>;
    const counter = anchor.web3.Keypair.generate();

    console.log("Provider wallet public key: ", provider.wallet.publicKey.toString());
    console.log("Counter address: ", counter.publicKey.toString());

    it("Is initialized!", async () => {
        // Should be initialised successfully
        const tx = await program.methods
            .initialise()
            .accounts({counter: counter.publicKey})
            .signers([counter])
            .rpc();

        const account = await program.account.counter.fetch(counter.publicKey);
        expect(account.count.toNumber()).to.equal(0);

        // Second attempt to initialise the same account should fail
        try {
            await program.methods
                .initialise()
                .accounts({counter: counter.publicKey})
                .signers([counter])
                .rpc();
            expect.fail("Should have thrown an error");
        } catch (error) {
            // Expected to fail
        }
    });


    it("Increment the count", async () => {
        // Called by provider wallet pubkey
        const tx = await program.methods
            .increment()
            .accounts({counter: counter.publicKey})
            .rpc();

        let account = await program.account.counter.fetch(counter.publicKey);
        expect(account.count.toNumber()).to.equal(1);

        // Called by the counter user
        const tx2 = await program.methods
            .increment()
            .accounts({counter: counter.publicKey, user: counter.publicKey})
            .signers([counter])
            .rpc();
        account = await program.account.counter.fetch(counter.publicKey);
        expect(account.count.toNumber()).to.equal(2);
    });

    it("Increment uninitialised account", async () => {
        const uninitialised_counter = anchor.web3.Keypair.generate();

        try {
            const tx = await program.methods
                .increment()
                .accounts({counter: uninitialised_counter.publicKey})
                .rpc();
            expect.fail("Should have thrown an error because the account is not initialised");
        } catch (error) {
            // Expect to fail
        }
    });

    it("Decrement the count", async () => {
        const tx = await program.methods
            .decrement()
            .accounts({counter: counter.publicKey})
            .rpc();

        let account = await program.account.counter.fetch(counter.publicKey);
        expect(account.count.toNumber()).to.equal(1);

        // Decrement once more
        const tx2 = await program.methods
            .decrement()
            .accounts({counter: counter.publicKey})
            .rpc();

        account = await program.account.counter.fetch(counter.publicKey);
        expect(account.count.toNumber()).to.equal(0);
    });
});
