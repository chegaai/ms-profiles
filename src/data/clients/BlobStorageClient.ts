import { IAppConfig } from '../../app.config'

import { AzureBlobStorageClient } from 'azure-blob-storage-client'

export class BlobStorageClient extends AzureBlobStorageClient{
  constructor (config: IAppConfig['azure']['storage']) {
    const { accountAccessKey, accountName, containerName, timeOut } = config
    super(accountAccessKey, accountName, containerName, timeOut)
  }
}
