import { StatusChanged } from '../generated/ShareholderRegistry/ShareholderRegistry';
import { log, Bytes } from '@graphprotocol/graph-ts';
import { getResolutionManagerEntity } from './resolution-manager-mapping';

const CONTRIBUTOR_STATUS = '0x84d5b933b93417199db826f5da9d5b1189791cb2dfd61240824c7e46b055f03d'
const FOUNDER_STATUS = '0x34ca5963a927ef9e959b015abbbcf1c6aad792304d77ee811d006bee69a132d0'
// not used for now
const INVESTOR_STATUS = '0x14480ae0991a8fe24c1733177e7d71ec79d1f142a7f0e5971a3b930e17759817'
const SHAREHOLDER_STATUS = '0x307a5ff72e442b798b18d109baae15fe48b6d3690fd14c03015a2f47dd89e2f1'

export function handleStatusChanged(event: StatusChanged): void {
  const address = event.params.account
  const resolutionMangerEntity = getResolutionManagerEntity()

  if ([CONTRIBUTOR_STATUS, FOUNDER_STATUS].includes(event.params.current.toHexString())) {
    log.info('SHAREHOLDER REGISTRY added contributor to resolution manager entity: account {}, current {}', [
      event.params.account.toHexString(),
      event.params.current.toHexString(),
    ])
    const newAddresses = resolutionMangerEntity.contributorsAddresses.concat([address])
    const uniqueAddresses: Bytes[] = []
    for (let index = 0; index < newAddresses.length; index++) {
      const currentAddress = newAddresses[index];
      if (!uniqueAddresses.includes(currentAddress)) {
        uniqueAddresses.push(currentAddress)
      }
    }
    resolutionMangerEntity.contributorsAddresses = uniqueAddresses
    resolutionMangerEntity.save()
    return
  }

  log.info('SHAREHOLDER REGISTRY removed contributor to resolution manager entity: account {}, current {}', [
    event.params.account.toHexString(),
    event.params.current.toHexString(),
  ])

  const oldAddresses = resolutionMangerEntity.contributorsAddresses
  const newAddresses: Bytes[] = []
  for (let index = 0; index < oldAddresses.length; index++) {
    const currentAddress = oldAddresses[index];
    if (currentAddress !== address) {
      newAddresses.push(currentAddress)
    }
  }
  resolutionMangerEntity.contributorsAddresses = newAddresses
  resolutionMangerEntity.save()
}
