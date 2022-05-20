import { log } from '@graphprotocol/graph-ts';
import {
  Transfer
} from "../generated/TelediskoToken/TelediskoToken"

export function handleTransfer(event: Transfer): void {
  log.info('handleTransfer called', [])
}
