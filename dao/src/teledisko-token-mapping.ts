import { BigInt } from '@graphprotocol/graph-ts';
import { Transfer } from "../generated/TelediskoToken/TelediskoToken"
import { DaoUser } from '../generated/schema';
import { getDaoManagerEntity } from './dao-manager';

export function handleTransfer(event: Transfer): void {
  const fromHexString = event.params.from.toHexString()
  const toHexString = event.params.to.toHexString()
  const value = event.params.value.toI32()

  const daoManagerEntity = getDaoManagerEntity()
  const fromDaoUser = DaoUser.load(fromHexString) || new DaoUser(fromHexString)
  if (fromDaoUser) {
    fromDaoUser.totalBalance = BigInt.fromI32(fromDaoUser.totalBalance.toI32() - value)

    // if from address is contributor, we should remove value from their unlocked temp balance
    if (daoManagerEntity.contributorsAddresses.includes(event.params.from)) {
      fromDaoUser.unlockedTempBalance = BigInt.fromI32(fromDaoUser.unlockedTempBalance.toI32() - value)
    }
  }

  const toDaoUser = DaoUser.load(toHexString) || new DaoUser(toHexString)  
  if (toDaoUser) {
    toDaoUser.totalBalance = BigInt.fromI32(toDaoUser.totalBalance.toI32() + value)
  }
}
