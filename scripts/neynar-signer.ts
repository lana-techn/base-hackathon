#!/usr/bin/env node
/**
 * Neynar Signer Management Script
 * 
 * Usage:
 *   npx ts-node scripts/neynar-signer.ts create     - Create a new signer
 *   npx ts-node scripts/neynar-signer.ts status     - Check signer status
 *   npx ts-node scripts/neynar-signer.ts info       - Show signer info
 */

const NEYNAR_API_BASE = 'https://api.neynar.com'

async function createSigner(apiKey: string) {
    console.log('🔐 Creating new Neynar signer...\n')

    const response = await fetch(`${NEYNAR_API_BASE}/v2/farcaster/signer/`, {
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        const error = await response.json()
        console.error('❌ Error creating signer:', error.message || response.statusText)
        process.exit(1)
    }

    const signer = await response.json()

    console.log('✅ Signer created successfully!\n')
    console.log('━'.repeat(50))
    console.log(`📋 Signer UUID:     ${signer.signer_uuid}`)
    console.log(`🔑 Public Key:      ${signer.public_key}`)
    console.log(`📊 Status:          ${signer.status}`)
    console.log('━'.repeat(50))

    if (signer.signer_approval_url) {
        console.log('\n⚠️  IMPORTANT: You need to approve this signer!')
        console.log(`🔗 Approval URL: ${signer.signer_approval_url}`)
        console.log('\n1. Open the URL above in your browser')
        console.log('2. Sign in with your Farcaster account')
        console.log('3. Approve the signer')
        console.log('4. Run this script again with "status" to verify\n')
    }

    console.log('\n📝 Add to your .env.local:')
    console.log('━'.repeat(50))
    console.log(`NEYNAR_API_KEY=${apiKey}`)
    console.log(`NEYNAR_SIGNER_UUID=${signer.signer_uuid}`)
    console.log('━'.repeat(50))

    return signer
}

async function getSignerStatus(apiKey: string, signerUuid: string) {
    console.log('🔍 Checking signer status...\n')

    const response = await fetch(`${NEYNAR_API_BASE}/v2/farcaster/signer?signer_uuid=${signerUuid}`, {
        method: 'GET',
        headers: {
            'x-api-key': apiKey,
        },
    })

    if (!response.ok) {
        const error = await response.json()
        console.error('❌ Error fetching signer:', error.message || response.statusText)
        process.exit(1)
    }

    const signer = await response.json()

    console.log('━'.repeat(50))
    console.log(`📋 Signer UUID:     ${signer.signer_uuid}`)
    console.log(`🔑 Public Key:      ${signer.public_key}`)
    console.log(`📊 Status:          ${getStatusEmoji(signer.status)} ${signer.status}`)
    if (signer.fid) {
        console.log(`👤 FID:             ${signer.fid}`)
    }
    console.log('━'.repeat(50))

    if (signer.status === 'approved') {
        console.log('\n✅ Signer is approved and ready to use!')
    } else if (signer.status === 'pending_approval') {
        console.log('\n⏳ Signer is pending approval.')
        if (signer.signer_approval_url) {
            console.log(`🔗 Approve at: ${signer.signer_approval_url}`)
        }
    } else if (signer.status === 'generated') {
        console.log('\n📝 Signer generated but not yet approved.')
        if (signer.signer_approval_url) {
            console.log(`🔗 Approve at: ${signer.signer_approval_url}`)
        }
    }

    return signer
}

function getStatusEmoji(status: string): string {
    switch (status) {
        case 'approved': return '✅'
        case 'pending_approval': return '⏳'
        case 'generated': return '📝'
        case 'revoked': return '❌'
        default: return '❓'
    }
}

function showHelp() {
    console.log(`
Neynar Signer Management Script
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usage:
  npx ts-node scripts/neynar-signer.ts <command>

Commands:
  create    Create a new signer (requires NEYNAR_API_KEY)
  status    Check status of existing signer (requires NEYNAR_API_KEY and NEYNAR_SIGNER_UUID)
  help      Show this help message

Environment Variables:
  NEYNAR_API_KEY      Your Neynar API key
  NEYNAR_SIGNER_UUID  Signer UUID (required for status command)

Examples:
  # Create new signer
  NEYNAR_API_KEY=xxx npx ts-node scripts/neynar-signer.ts create

  # Check signer status
  NEYNAR_API_KEY=xxx NEYNAR_SIGNER_UUID=yyy npx ts-node scripts/neynar-signer.ts status
`)
}

async function main() {
    const command = process.argv[2] || 'help'
    const apiKey = process.env.NEYNAR_API_KEY
    const signerUuid = process.env.NEYNAR_SIGNER_UUID

    if (command === 'help') {
        showHelp()
        return
    }

    if (!apiKey) {
        console.error('❌ Error: NEYNAR_API_KEY environment variable is required')
        console.log('\nRun with: NEYNAR_API_KEY=your_key npx ts-node scripts/neynar-signer.ts <command>')
        process.exit(1)
    }

    switch (command) {
        case 'create':
            await createSigner(apiKey)
            break

        case 'status':
            if (!signerUuid) {
                console.error('❌ Error: NEYNAR_SIGNER_UUID is required for status command')
                process.exit(1)
            }
            await getSignerStatus(apiKey, signerUuid)
            break

        default:
            console.error(`❌ Unknown command: ${command}`)
            showHelp()
            process.exit(1)
    }
}

main().catch((error) => {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
})
