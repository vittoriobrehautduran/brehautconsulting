// AWS Secrets Manager helper to fetch secrets

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager'

let cachedSecret: string | null = null

// Get secret from AWS Secrets Manager with caching
export async function getSecretFromAWS(secretName: string): Promise<string> {
  // Return cached secret if available (for performance)
  if (cachedSecret) {
    return cachedSecret
  }

  const region = process.env.AWS_SES_REGION || process.env.AWS_REGION || 'eu-west-1'
  
  const client = new SecretsManagerClient({
    region,
    credentials: process.env.SES_ACCESS_KEY_ID && process.env.SES_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.SES_ACCESS_KEY_ID,
          secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
        }
      : undefined,
  })

  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
      })
    )

    if (response.SecretString) {
      cachedSecret = response.SecretString
      return cachedSecret
    }

    throw new Error('Secret value is not a string')
  } catch (error) {
    console.error('Error fetching secret from AWS Secrets Manager:', error)
    throw error
  }
}

