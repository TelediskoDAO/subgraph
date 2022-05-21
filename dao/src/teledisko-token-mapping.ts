import { Address } from '@graphprotocol/graph-ts';
import { Transfer } from "../generated/TelediskoToken/TelediskoToken"
import { DaoUser } from '../generated/schema';
import { getDaoManagerEntity } from './dao-manager';

export function handleTransfer(event: Transfer): void {
  const fromHexString = event.params.from.toHexString()
  const toHexString = event.params.to.toHexString()
  const value = event.params.value
  
  if (event.params.from != Address.zero()) {
    const daoManagerEntity = getDaoManagerEntity()
    const fromDaoUser = DaoUser.load(fromHexString) || new DaoUser(fromHexString)
    if (fromDaoUser) {
      fromDaoUser.totalBalance = fromDaoUser.totalBalance.minus(value)
      fromDaoUser.address = event.params.from
  
      // if from address is contributor, we should remove value from their unlocked temp balance
      if (daoManagerEntity.contributorsAddresses.includes(event.params.from)) {
        fromDaoUser.unlockedTempBalance = fromDaoUser.unlockedTempBalance.minus(value)
      }

      fromDaoUser.save()
    }
  }

  const toDaoUser = DaoUser.load(toHexString) || new DaoUser(toHexString)  
  if (toDaoUser) {
    toDaoUser.totalBalance = toDaoUser.totalBalance.plus(value)
    toDaoUser.address = event.params.to
    toDaoUser.save()
  }
}
