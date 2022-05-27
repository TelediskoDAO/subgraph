import { Address, log } from '@graphprotocol/graph-ts';
import { OfferCreated, OfferMatched, Transfer } from "../generated/TelediskoToken/TelediskoToken"
import { DaoUser, Offer } from '../generated/schema';
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

export function handleOfferCreated(event: OfferCreated): void {
  const fromHexString = event.params.from.toHexString()
  const id = event.params.id.toHexString()
  const offerId = id + '-' + fromHexString

  const offerEntity = new Offer(offerId)

  offerEntity.from = event.params.from
  offerEntity.amount = event.params.amount
  offerEntity.expirationTimestamp = event.params.expiration

  offerEntity.save()
}

export function handleOfferMatched(event: OfferMatched): void {
  const fromHexString = event.params.from.toHexString()
  const id = event.params.id.toHexString()
  const offerId = id + '-' + fromHexString

  const offerEntity = Offer.load(offerId)

  if (!offerEntity) {
    log.error('Offer {} not found',[offerId])
    return
  }

  offerEntity.amount = offerEntity.amount.minus(event.params.amount)
  offerEntity.save()

  const daoManagerEntity = getDaoManagerEntity()
  const fromDaoUser = DaoUser.load(fromHexString) || new DaoUser(fromHexString)

  // if from address is contributor, we should remove value from their unlocked temp balance
  if (daoManagerEntity.contributorsAddresses.includes(event.params.from)) {
    fromDaoUser.unlockedTempBalance = fromDaoUser.unlockedTempBalance.plus(event.params.amount)
  }

  fromDaoUser.save()
}

