## Local development

To build the program you should run:
```
$ archor build
```

To run the tests against the localnet:
```
$ anchor test
```

## Deploying to devnet

### Prerequisites

You need to set Solana CLI to point to Devnet:
```
$ solana config set --url devnet
```

Also you need to create a new keypair that will become program authority for deployment/upgrades:
```
$ solana-keygen new --outfile ~/.config/solana/devnet.json
<save the pubkey and the seed phrase for recovery in case you loose this json file.
```

You will also need ~1.5 SOL for deploying the program to Devnet, so you should have some SOL in your program authority account:
```
$ solana airdrop 2 --keypair ~/.config/solana/devnet.json
```

### Deploying

```
$ anchor deploy --provider.cluster devnet --provider.wallet ~/.config/solana/devnet.json
```

### Running tests

You can use different public keys with this program to initialise the counter and run the tests. Actually 
the tests are written in the way that they will generate new public key each time you run them.

```
$ anchor test --provider.cluster devnet --skip-deploy
```

The tests will output:
```
Provider wallet public key:  9f2SCYtmvQHxDN5wFE3Fp7attDbLD2W82dWBTsDLz4gd
Counter address:  GzXKhZxbnTRV3wNTtx3WWuxtg3JGrqr9LxdzVSctxVVC
```

To check the account has been actually created and see its raw data you can use:
```
$ solana account GzXKhZxbnTRV3wNTtx3WWuxtg3JGrqr9LxdzVSctxVVC --url devnet

Public Key: GzXKhZxbnTRV3wNTtx3WWuxtg3JGrqr9LxdzVSctxVVC
Balance: 0.00100224 SOL
Owner: 2ow8n54g7gu3stq9emq4Tu7ua7YjtZQ2s4X6C5QVKFgC
Executable: false
Rent Epoch: 18446744073709551615
Length: 16 (0x10) bytes
0000:   ff b0 04 f5  bc fd 7c 19  00 00 00 00  00 00 00 00   ......|.........
```
In data first 8 bytes defines the discriminator and the remaining 8 bytes are i64 counter. In this output
the counter is 0.

The output below shows the counter with value 2.
```
➜  $ solana account AvtDJfmkSH8SnZ92mBcwswN5zoDCMwqPUD8cDf3XZtXS --url devnet

Public Key: AvtDJfmkSH8SnZ92mBcwswN5zoDCMwqPUD8cDf3XZtXS
Balance: 0.00100224 SOL
Owner: 2ow8n54g7gu3stq9emq4Tu7ua7YjtZQ2s4X6C5QVKFgC
Executable: false
Rent Epoch: 18446744073709551615
Length: 16 (0x10) bytes
0000:   ff b0 04 f5  bc fd 7c 19  02 00 00 00  00 00 00 00   ......|.........

```

### Useful notes

If you want to get all the accounts created with this program you can run:
```
$ curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '
  {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getProgramAccounts",
    "params": [
      "2ow8n54g7gu3stq9emq4Tu7ua7YjtZQ2s4X6C5QVKFgC"
    ]
  }' | jq 
```

The expected output will be like this:
```
{
  "jsonrpc": "2.0",
  "result": [
    {
      "account": {
        "data": "YaFte9DRNdjgD6HHh5acp7",
        "executable": false,
        "lamports": 1002240,
        "owner": "2ow8n54g7gu3stq9emq4Tu7ua7YjtZQ2s4X6C5QVKFgC",
        "rentEpoch": 18446744073709552000,
        "space": 16
      },
      "pubkey": "GzXKhZxbnTRV3wNTtx3WWuxtg3JGrqr9LxdzVSctxVVC"
    },
    {
      "account": {
        "data": "YaFte9DRNdjgYVdKJiZqM9",
        "executable": false,
        "lamports": 1002240,
        "owner": "2ow8n54g7gu3stq9emq4Tu7ua7YjtZQ2s4X6C5QVKFgC",
        "rentEpoch": 18446744073709552000,
        "space": 16
      },
      "pubkey": "AvtDJfmkSH8SnZ92mBcwswN5zoDCMwqPUD8cDf3XZtXS"
    }
  ],
  "id": 1
}
```
