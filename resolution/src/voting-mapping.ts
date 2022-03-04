
import { log } from '@graphprotocol/graph-ts';
import { DelegateChanged } from '../generated/Voting/Voting';

export function handleDelegateChanged(event: DelegateChanged): void {
  log.info('VOTING: handleDelegateChanged, currentDelegate: {} newDelegate: {} delegator: {}', [
    event.params.currentDelegate.toHexString(),
    event.params.newDelegate.toHexString(),
    event.params.delegator.toHexString()
  ])
}