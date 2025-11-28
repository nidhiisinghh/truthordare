"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { contractABI, contractAddress } from "@/lib/contract"

export interface ContractState {
  isLoading: boolean
  isPending: boolean
  isConfirming: boolean
  isConfirmed: boolean
  hash: `0x${string}` | undefined
  error: Error | null
}

export interface ContractData {
  truthCount: number
  dareCount: number
  randomTruth: string
  randomDare: string
}

export interface ContractActions {
  addTruth: (text: string) => Promise<void>
  addDare: (text: string) => Promise<void>
  fetchTruth: () => void
  fetchDare: () => void
}

export const useContract = () => {
  const { address } = useAccount()

  const { data: truthCount, refetch: refetchTruthCount } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getTruthCount",
  })

  const { data: dareCount, refetch: refetchDareCount } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getDareCount",
  })

  const { data: randomTruth, refetch: fetchTruth } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getRandomTruth",
  })

  const { data: randomDare, refetch: fetchDare } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getRandomDare",
  })

  const { writeContractAsync, data: hash, error, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isConfirmed) {
      refetchTruthCount()
      refetchDareCount()
      fetchTruth()
      fetchDare()
    }
  }, [isConfirmed])

  const addTruth = async (text: string) => {
    if (!text) return
    try {
      setIsLoading(true)
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "addTruth",
        args: [text],
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addDare = async (text: string) => {
    if (!text) return
    try {
      setIsLoading(true)
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "addDare",
        args: [text],
      })
    } finally {
      setIsLoading(false)
    }
  }

  const data: ContractData = {
    truthCount: truthCount ? Number(truthCount) : 0,
    dareCount: dareCount ? Number(dareCount) : 0,
    randomTruth: randomTruth || "",
    randomDare: randomDare || "",
  }

  const actions: ContractActions = { addTruth, addDare, fetchTruth, fetchDare }

  const state: ContractState = {
    isLoading: isLoading || isPending || isConfirming,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
  }

  return { data, actions, state }
}
