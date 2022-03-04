import { Approval, RoleAdminChanged, RoleGranted, RoleRevoked, StatusChanged } from '../generated/ShareholderRegistry/ShareholderRegistry';
import { log } from '@graphprotocol/graph-ts';

export function handleRoleAdminChanged(event: RoleAdminChanged): void {
  log.info('SHAREHOLDER REGISTRY handleRoleAdminChanged: role {}, newAdminRole {}, previousAdminRole {}', [
    event.params.role.toHexString(), event.params.newAdminRole.toHexString(), event.params.previousAdminRole.toHexString()
  ])
}

export function handleRoleGranted(event: RoleGranted): void {
  log.info('SHAREHOLDER REGISTRY handleRoleGranted: role {}, account {}, sender {}', [
    event.params.role.toHexString(), event.params.account.toHexString(), event.params.sender.toHexString()
  ])
}

export function handleRoleRevoked(event: RoleRevoked): void {
  log.info('SHAREHOLDER REGISTRY handleRoleRevoked: role {}, account {},  sender {}', [
    event.params.role.toHexString(), event.params.account.toHexString(), event.params.sender.toHexString()
  ])
}

export function handleStatusChanged(event: StatusChanged): void {
  log.info('SHAREHOLDER REGISTRY handleStatusChanged: account {}, previous {},  current {}', [
    event.params.account.toHexString(),
    event.params.previous.toHexString(),
    event.params.current.toHexString(),
  ])
}
