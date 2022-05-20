import { StatusChanged } from '../generated/ShareholderRegistry/ShareholderRegistry';
import { log, Bytes } from '@graphprotocol/graph-ts';
import { getResolutionManagerEntity } from './resolution-manager-mapping';

const CONTRIBUTOR_STATUS = '0x84d5b933b93417199db826f5da9d5b1189791cb2dfd61240824c7e46b055f03d'
const FOUNDER_STATUS = '0x34ca5963a927ef9e959b015abbbcf1c6aad792304d77ee811d006bee69a132d0'
// not used for now
const INVESTOR_STATUS = '0x14480ae0991a8fe24c1733177e7d71ec79d1f142a7f0e5971a3b930e17759817'
const SHAREHOLDER_STATUS = '0x307a5ff72e442b798b18d109baae15fe48b6d3690fd14c03015a2f47dd89e2f1'

function getStatusNameFromHexString(hexString: string): string {
  if (hexString == FOUNDER_STATUS) {
    return 'FOUNDER'
  }
  if (hexString == CONTRIBUTOR_STATUS) {
    return 'CONTRIBUTOR'
  }
  if (hexString == INVESTOR_STATUS) {
    return 'INVESTOR'
  }
  if (hexString == SHAREHOLDER_STATUS) {
    return 'SHAREHOLDER'
  }
  return 'UNKNOWN_TYPE: ' + hexString
}

function getNewAddressesWithoutAddress(resolutionManagerEntityList: Bytes[], toRemove: Bytes): Bytes[] {
  const newAddresses: Bytes[] = []
  for (let index = 0; index < resolutionManagerEntityList.length; index++) {
    const currentAddress = resolutionManagerEntityList[index];
    if (currentAddress != toRemove) {
      newAddresses.push(currentAddress)
    }
  }
  return newAddresses
}

export function handleStatusChanged(event: StatusChanged): void {
  const address = event.params.account
  const resolutionMangerEntity = getResolutionManagerEntity()

  const previousHexString = event.params.previous.toHexString()
  const currentHexString = event.params.current.toHexString()

  log.info('SHAREHOLDER_REGISTRY handleStatusChanged, address {}, previous {}, current {}', [
    address.toHexString(),
    getStatusNameFromHexString(previousHexString),
    getStatusNameFromHexString(currentHexString)
  ])

  // remove the address from the "previous" list/s
  if (previousHexString == FOUNDER_STATUS) {
    const newFoundersAddresses = getNewAddressesWithoutAddress(resolutionMangerEntity.foundersAddresses, address)
    resolutionMangerEntity.foundersAddresses = newFoundersAddresses
    const newContributorsAddresses = getNewAddressesWithoutAddress(resolutionMangerEntity.contributorsAddresses, address)
    resolutionMangerEntity.contributorsAddresses = newContributorsAddresses
  }

  if (previousHexString == CONTRIBUTOR_STATUS) {
    const newContributorsAddresses = getNewAddressesWithoutAddress(resolutionMangerEntity.contributorsAddresses, address)
    resolutionMangerEntity.contributorsAddresses = newContributorsAddresses
  }

  if (previousHexString == INVESTOR_STATUS) {
    const newInvestorsAddresses = getNewAddressesWithoutAddress(resolutionMangerEntity.investorsAddresses, address)
    resolutionMangerEntity.investorsAddresses = newInvestorsAddresses
  }

  if (previousHexString == SHAREHOLDER_STATUS) {
    const newShareholdersAddresses = getNewAddressesWithoutAddress(resolutionMangerEntity.shareholdersAddresses, address)
    resolutionMangerEntity.shareholdersAddresses = newShareholdersAddresses
  }

  // add the address to the "current" list/s
  if (currentHexString == FOUNDER_STATUS) {
    resolutionMangerEntity.foundersAddresses = resolutionMangerEntity.foundersAddresses.concat([address])
    resolutionMangerEntity.contributorsAddresses = resolutionMangerEntity.contributorsAddresses.concat([address])
  }

  if (currentHexString == CONTRIBUTOR_STATUS) {
    resolutionMangerEntity.contributorsAddresses = resolutionMangerEntity.contributorsAddresses.concat([address])
  }

  if (currentHexString == INVESTOR_STATUS) {
    resolutionMangerEntity.investorsAddresses = resolutionMangerEntity.investorsAddresses.concat([address])
  }

  if (currentHexString == SHAREHOLDER_STATUS) {
    resolutionMangerEntity.shareholdersAddresses = resolutionMangerEntity.shareholdersAddresses.concat([address])
  }

  resolutionMangerEntity.save()
  return
}
