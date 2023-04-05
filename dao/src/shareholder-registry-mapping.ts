import { StatusChanged } from '../generated/ShareholderRegistry/ShareholderRegistry';
import { log, Bytes } from '@graphprotocol/graph-ts';
import { getDaoManagerEntity } from './dao-manager';
import { DaoUser } from '../generated/schema';

const CONTRIBUTOR_STATUS = '0x84d5b933b93417199db826f5da9d5b1189791cb2dfd61240824c7e46b055f03d'
const MANAGING_BOARD_STATUS = '0x1417f6a224499a6e3918f776fd5ff7d6d29c2d693d9862a904be8a74faad51f1'
// not used for now
const INVESTOR_STATUS = '0x14480ae0991a8fe24c1733177e7d71ec79d1f142a7f0e5971a3b930e17759817'
const SHAREHOLDER_STATUS = '0x307a5ff72e442b798b18d109baae15fe48b6d3690fd14c03015a2f47dd89e2f1'

function getStatusNameFromHexString(hexString: string): string {
  if (hexString == MANAGING_BOARD_STATUS) {
    return 'MANAGING_BOARD'
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

function getNewAddressesWithoutAddress(daoManagerEntityList: Bytes[], toRemove: Bytes): Bytes[] {
  const newAddresses: Bytes[] = []
  for (let index = 0; index < daoManagerEntityList.length; index++) {
    const currentAddress = daoManagerEntityList[index];
    if (currentAddress != toRemove) {
      newAddresses.push(currentAddress)
    }
  }
  return newAddresses
}

export function handleStatusChanged(event: StatusChanged): void {
  const address = event.params.account
  const addressHexString = address.toHexString()
  const daoMangerEntity = getDaoManagerEntity()

  const previousHexString = event.params.previous.toHexString()
  const currentHexString = event.params.current.toHexString()

  log.info('SHAREHOLDER_REGISTRY handleStatusChanged, address {}, previous {}, current {}', [
    addressHexString,
    getStatusNameFromHexString(previousHexString),
    getStatusNameFromHexString(currentHexString)
  ])

  const daoUser = DaoUser.load(addressHexString) || new DaoUser(addressHexString)
  if (daoUser) {
    daoUser.address = address
    daoUser.save()
  }

  // remove the address from the "previous" list/s
  if (previousHexString == MANAGING_BOARD_STATUS) {
    const newManagingBoardAddresses = getNewAddressesWithoutAddress(daoMangerEntity.managingBoardAddresses, address)
    daoMangerEntity.managingBoardAddresses = newManagingBoardAddresses
    const newContributorsAddresses = getNewAddressesWithoutAddress(daoMangerEntity.contributorsAddresses, address)
    daoMangerEntity.contributorsAddresses = newContributorsAddresses
  }

  if (previousHexString == CONTRIBUTOR_STATUS) {
    const newContributorsAddresses = getNewAddressesWithoutAddress(daoMangerEntity.contributorsAddresses, address)
    daoMangerEntity.contributorsAddresses = newContributorsAddresses
  }

  if (previousHexString == INVESTOR_STATUS) {
    const newInvestorsAddresses = getNewAddressesWithoutAddress(daoMangerEntity.investorsAddresses, address)
    daoMangerEntity.investorsAddresses = newInvestorsAddresses
  }

  if (previousHexString == SHAREHOLDER_STATUS) {
    const newShareholdersAddresses = getNewAddressesWithoutAddress(daoMangerEntity.shareholdersAddresses, address)
    daoMangerEntity.shareholdersAddresses = newShareholdersAddresses
  }

  // add the address to the "current" list/s
  if (currentHexString == MANAGING_BOARD_STATUS) {
    daoMangerEntity.managingBoardAddresses = daoMangerEntity.managingBoardAddresses.concat([address])
    daoMangerEntity.contributorsAddresses = daoMangerEntity.contributorsAddresses.concat([address])
  }

  if (currentHexString == CONTRIBUTOR_STATUS) {
    daoMangerEntity.contributorsAddresses = daoMangerEntity.contributorsAddresses.concat([address])
  }

  if (currentHexString == INVESTOR_STATUS) {
    daoMangerEntity.investorsAddresses = daoMangerEntity.investorsAddresses.concat([address])
  }

  if (currentHexString == SHAREHOLDER_STATUS) {
    daoMangerEntity.shareholdersAddresses = daoMangerEntity.shareholdersAddresses.concat([address])
  }

  daoMangerEntity.save()
  return
}
