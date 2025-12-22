import { useState, useEffect, useCallback } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { parseEventLogs, Address } from 'viem'
import { getContractConfig } from '@/config/contracts'
import { Position, PositionStatus } from '@/types'
import { base } from 'viem/chains'

interface UsePositionTrackingReturn {
  positions: Position[]
  isLoading: boolean
  error: string | null
  refreshPositions: () => Promise<void>
}

interface PositionEvent {
  user: Address
  positionId: bigint
  asset: string
  strike: bigint
  premium: bigint
  expiry: bigint
  isCall: boolean
  timestamp: bigint
}

export function usePositionTracking(): UsePositionTrackingReturn {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  
  const [positions, setPositions] = useState<Position[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Position opened event ABI
  const positionOpenedABI = {
    type: 'event',
    name: 'PositionOpened',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'positionId', type: 'uint256', indexed: true },
      { name: 'asset', type: 'string', indexed: false },
      { name: 'strike', type: 'uint256', indexed: false },
      { name: 'premium', type: 'uint256', indexed: false },
      { name: 'expiry', type: 'uint256', indexed: false },
      { name: 'isCall', type: 'bool', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false }
    ]
  } as const

  // Position closed event ABI
  const positionClosedABI = {
    type: 'event',
    name: 'PositionClosed',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'positionId', type: 'uint256', indexed: true },
      { name: 'pnl', type: 'int256', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false }
    ]
  } as const

  const parsePositionEvent = useCallback((log: any): Position => {
    const event = log.args as PositionEvent
    
    return {
      id: event.positionId.toString(),
      optionToken: event.user, // Temporary - should be actual option token
      optionType: event.isCall ? 'CALL' : 'PUT',
      strike: Number(event.strike) / 1e18, // Convert from wei
      expiry: Number(event.expiry), // Keep as timestamp number
      entryPrice: Number(event.premium) / 1e6, // Convert from USDC decimals
      currentPrice: Number(event.premium) / 1e6, // Initial price
      quantity: 1, // Default quantity
      pnl: 0, // Will be calculated separately
      pnlPercentage: 0,
      status: 'OPEN' as PositionStatus,
      openedAt: Number(event.timestamp) // Keep as timestamp number
    }
  }, [])

  const refreshPositions = useCallback(async () => {
    if (!address || !publicClient) return

    setIsLoading(true)
    setError(null)

    try {
      // Get current block number
      const currentBlock = await publicClient.getBlockNumber()
      const fromBlock = currentBlock - 10000n // Last ~10k blocks (~2 hours on Base)

      // Get contract config for Base
      const contractConfig = getContractConfig(base.id)

      // Fetch position opened events
      const openedLogs = await publicClient.getLogs({
        address: contractConfig.sentientTrader,
        event: positionOpenedABI,
        args: {
          user: address
        },
        fromBlock,
        toBlock: 'latest'
      })

      // Fetch position closed events
      const closedLogs = await publicClient.getLogs({
        address: contractConfig.sentientTrader,
        event: positionClosedABI,
        args: {
          user: address
        },
        fromBlock,
        toBlock: 'latest'
      })

      // Parse opened positions
      const openedPositions = openedLogs.map(parsePositionEvent)
      
      // Mark closed positions
      const closedPositionIds = new Set(
        closedLogs.map(log => (log.args as any).positionId.toString())
      )

      const updatedPositions = openedPositions.map(position => ({
        ...position,
        status: closedPositionIds.has(position.id) ? 'CLOSED' as PositionStatus : position.status
      }))

      setPositions(updatedPositions)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch positions'
      setError(errorMessage)
      console.error('Position tracking error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [address, publicClient, parsePositionEvent])

  // Real-time event listening
  useEffect(() => {
    if (!address || !publicClient) return

    let unwatch: (() => void) | undefined

    const setupEventListening = async () => {
      try {
        const contractConfig = getContractConfig(base.id)
        
        // Watch for new position events
        unwatch = publicClient.watchEvent({
          address: contractConfig.sentientTrader,
          event: positionOpenedABI,
          args: {
            user: address
          },
          onLogs: (logs) => {
            const newPositions = logs.map(parsePositionEvent)
            setPositions(prev => [...prev, ...newPositions])
          }
        })
      } catch (err) {
        console.error('Failed to setup event listening:', err)
      }
    }

    setupEventListening()

    return () => {
      if (unwatch) {
        unwatch()
      }
    }
  }, [address, publicClient, parsePositionEvent])

  // Initial load
  useEffect(() => {
    refreshPositions()
  }, [refreshPositions])

  return {
    positions,
    isLoading,
    error,
    refreshPositions
  }
}

// Utility hook for position PnL calculation
export function usePositionPnL(position: Position) {
  const [pnl, setPnl] = useState<number>(0)
  const [currentPrice, setCurrentPrice] = useState<number>(0)

  useEffect(() => {
    // Calculate PnL based on current market price
    const calculatePnL = () => {
      if (!currentPrice || position.status === 'CLOSED') return

      const intrinsicValue = position.optionType === 'CALL' 
        ? Math.max(0, currentPrice - position.strike)
        : Math.max(0, position.strike - currentPrice)

      const pnlValue = intrinsicValue - position.entryPrice
      setPnl(pnlValue)
    }

    // Subscribe to price updates (would connect to WebSocket)
    const priceInterval = setInterval(() => {
      // Mock price update - replace with real WebSocket data
      const mockPrice = 3200 + Math.random() * 200 - 100 // Default to ETH price
      setCurrentPrice(mockPrice)
      calculatePnL()
    }, 1000)

    return () => clearInterval(priceInterval)
  }, [position, currentPrice])

  return { pnl, currentPrice }
}