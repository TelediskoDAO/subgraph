import { DelegateChanged } from '../generated/Voting/Voting';
import { DelegationUser } from '../generated/schema';
import { log } from '@graphprotocol/graph-ts';

export function handleDelegateChanged(event: DelegateChanged): void {
  const delegatorHexString = event.params.delegator.toHexString()
  const newDelegateHexString = event.params.newDelegate.toHexString()

  log.info('VOTING handleDelegateChanged, delegator {}, newDelegate {}', [
    delegatorHexString,
    newDelegateHexString
  ])
  
  const currentDelegator = DelegationUser.load(delegatorHexString) || new DelegationUser(delegatorHexString)

  if (currentDelegator) {
    currentDelegator.address = event.params.delegator
    currentDelegator.delegated = event.params.newDelegate
    currentDelegator.save()
  }
}