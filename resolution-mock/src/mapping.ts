import {
  ResolutionApproved as ResolutionApprovedEvent,
  ResolutionCreated as ResolutionCreatedEvent,
  ResolutionTest as ResolutionTestEvent,
  ResolutionUpdated as ResolutionUpdatedEvent
} from "../generated/ResolutionMock/ResolutionMock"
import {
  ResolutionApproved,
  ResolutionCreated,
  ResolutionTest,
  ResolutionUpdated
} from "../generated/schema"

import { ipfs } from '@graphprotocol/graph-ts/index'

export function handleResolutionApproved(event: ResolutionApprovedEvent): void {
  let entity = new ResolutionApproved(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.approvedFrom = event.params.approvedFrom
  entity.approvedId = event.params.approvedId
  entity.testData = event.params.testData
  entity.save()
}

export function handleResolutionCreated(event: ResolutionCreatedEvent): void {
  let entity = new ResolutionCreated(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.createdFrom = event.params.createdFrom
  entity.createdId = event.params.createdId
  entity.content = ipfs.cat(event.params.contentHash)
  entity.save()
}

export function handleResolutionTest(event: ResolutionTestEvent): void {
  let entity = new ResolutionTest(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.approvedFrom = event.params.approvedFrom
  entity.approvedId = event.params.approvedId
  entity.save()
}

export function handleResolutionUpdated(event: ResolutionUpdatedEvent): void {
  let entity = new ResolutionUpdated(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.updatedFrom = event.params.updatedFrom
  entity.updatedId = event.params.updatedId
  entity.save()
}
