"use client"

import { useState, useEffect, useCallback } from "react"
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import {useWallet, useConnection, useAnchorWallet, AnchorWallet} from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Wallet, RefreshCw, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import CounterIDL from "@/counter_program.json";
import { Program, Idl, AnchorProvider, setProvider, BN } from "@coral-xyz/anchor"
import type { CounterProgram } from "@/counter_program"

interface CounterAccount {
  publicKey: PublicKey
  account: {
    count: BN
  }
}

export function getCounterProgram(provider: AnchorProvider) {
  return new Program(CounterIDL as CounterProgram, provider);
}

export default function SolanaCounterApp() {
  const { publicKey, sendTransaction, connected } = useWallet()
  const wallet = useAnchorWallet()
  const { connection } = useConnection()
  const { toast } = useToast()
  const provider = new AnchorProvider(connection, wallet as AnchorWallet, {});
  const program = getCounterProgram(provider);

  const [counterAccounts, setCounterAccounts] = useState<CounterAccount[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [balance, setBalance] = useState<number>(0)

  // Fetch wallet balance
  const fetchBalance = useCallback(async () => {
    if (!publicKey || !connection) return

    try {
      const balance = await connection.getBalance(publicKey)
      setBalance(balance / LAMPORTS_PER_SOL)
    } catch (error) {
      console.error("Error fetching balance:", error)
    }
  }, [publicKey, connection])

  // Mock function to fetch counter accounts
  const fetchCounterAccounts = useCallback(async () => {
    if (!publicKey) return

    setLoading(true)
    try {

      const accounts = await program.account.counter.all()
      console.log(accounts)

      if (accounts) {
        setCounterAccounts(accounts)
      }
    } catch (error) {
      console.error("Error fetching counter accounts:", error)
      toast({
        title: "Error",
        description: "Failed to fetch counter accounts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [publicKey, toast])

  // Create new counter account
  const createCounterAccount = async () => {
    if (!publicKey || !sendTransaction) return

    setCreating(true)
    try {
      // In a real app, you would create an actual Solana account and call your program
      // For demo purposes, we'll simulate this
      const newAccount: CounterAccount = {
        publicKey: PublicKey.unique().toString(),
        count: 0,
      }

      const updatedAccounts = [...counterAccounts, newAccount]
      setCounterAccounts(updatedAccounts)
      localStorage.setItem(`counters_${publicKey.toString()}`, JSON.stringify(updatedAccounts))

      toast({
        title: "Success",
        description: "Counter account created successfully!",
      })
    } catch (error) {
      console.error("Error creating counter account:", error)
      toast({
        title: "Error",
        description: "Failed to create counter account",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  // Update counter value
  const updateCounter = async (accountPublicKey: string, increment: boolean) => {
    if (!publicKey) return

    try {
      let tx;
      if (increment) {
        tx = await program.methods.increment().accounts({counter: accountPublicKey}).rpc({skipPreflight: true})
      } else {
        tx = await program.methods.decrement().accounts({counter: accountPublicKey}).rpc({skipPreflight: true})
      }
      console.log(tx)

      fetchCounterAccounts()
      toast({
        title: "Success",
        description: `Counter ${increment ? "incremented" : "decremented"} successfully!`,
      })
    } catch (error) {
      console.error("Error updating counter:", error)
      toast({
        title: "Error",
        description: "Failed to update counter",
        variant: "destructive",
      })
    }
  }

  // Effects
  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance()
      fetchCounterAccounts()
    }
  }, [connected, publicKey, fetchBalance, fetchCounterAccounts])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Solana Counter dApp
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect your wallet to create counter accounts and interact with the Solana blockchain
          </p>
        </div>

        {/* Wallet Connection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
              {connected && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchBalance}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              )}
            </div>

            {connected && publicKey && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Wallet Address:</span>
                  <Badge variant="secondary" className="font-mono">
                    {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Balance:</span>
                  <Badge variant="outline">{balance.toFixed(4)} SOL</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {connected && (
          <>
            <Separator />

            {/* Create Counter Account */}
            <Card>
              <CardHeader>
                <CardTitle>Create Counter Account</CardTitle>
                <CardDescription>Create a new counter account on the Solana blockchain</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={createCounterAccount}
                  disabled={creating}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {creating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Counter
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Counter Accounts List */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Counter Accounts</CardTitle>
                  <CardDescription>Manage your counter accounts and their values</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={fetchCounterAccounts} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  </div>
                ) : counterAccounts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No counter accounts found.</p>
                    <p className="text-sm">Create your first counter account above!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {counterAccounts.map((account, index) => (
                      <Card key={account.publicKey} className="border-2">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">#{index + 1}</Badge>
                                <span className="font-mono text-sm text-gray-600">
                                  {account.publicKey.toString().slice(0, 8)}...{account.publicKey.toString().slice(-8)}
                                </span>
                              </div>
                              <div className="text-2xl font-bold text-purple-600">Count: {account.account.count.toNumber()}</div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateCounter(account.publicKey, false)}
                                disabled={account.count === 0}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateCounter(account.publicKey, true)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {!connected && (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Wallet className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Connect Your Wallet</h3>
              <p className="text-gray-500 mb-4">Please connect your Solana wallet to start using the counter dApp</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
