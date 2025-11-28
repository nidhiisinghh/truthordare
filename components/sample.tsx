"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useContract } from "@/hooks/useContract"

const SampleIntregation = () => {
  const { isConnected } = useAccount()

  const [truthInput, setTruthInput] = useState("")
  const [dareInput, setDareInput] = useState("")

  const { data, actions, state } = useContract()

  const handleAddTruth = async () => {
    await actions.addTruth(truthInput)
    setTruthInput("")
  }

  const handleAddDare = async () => {
    await actions.addDare(dareInput)
    setDareInput("")
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Connect Wallet To Use Truth or Dare Contract</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">

      <h1 className="text-3xl font-bold">Truth or Dare Contract</h1>

      <div className="grid grid-cols-2 gap-4 text-lg">
        <p>Truths: {data.truthCount}</p>
        <p>Dares: {data.dareCount}</p>
      </div>

      <div className="p-4 border rounded">
        <h2 className="font-semibold mb-2">Add Truth</h2>
        <input
          type="text"
          value={truthInput}
          onChange={(e) => setTruthInput(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          onClick={handleAddTruth}
          disabled={state.isLoading || !truthInput}
          className="w-full mt-2 p-2 bg-blue-600 text-white rounded"
        >
          Add Truth
        </button>
      </div>

      <div className="p-4 border rounded">
        <h2 className="font-semibold mb-2">Add Dare</h2>
        <input
          type="text"
          value={dareInput}
          onChange={(e) => setDareInput(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          onClick={handleAddDare}
          disabled={state.isLoading || !dareInput}
          className="w-full mt-2 p-2 bg-red-600 text-white rounded"
        >
          Add Dare
        </button>
      </div>

      <div className="p-4 border rounded space-y-2">
        <p><strong>Random Truth:</strong> {data.randomTruth}</p>
        <button onClick={actions.fetchTruth} className="w-full p-2 bg-gray-700 text-white rounded">Get Random Truth</button>

        <p><strong>Random Dare:</strong> {data.randomDare}</p>
        <button onClick={actions.fetchDare} className="w-full p-2 bg-gray-700 text-white rounded">Get Random Dare</button>
      </div>

      {state.hash && <p className="text-xs break-all">TX: {state.hash}</p>}
      {state.error && <p className="text-red-500">{state.error.message}</p>}
    </div>
  )
}

export default SampleIntregation
