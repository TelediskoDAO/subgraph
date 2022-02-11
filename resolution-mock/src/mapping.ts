import {
  DelegateLostVotingPower as DelegateLostVotingPowerEvent,
  ResolutionApproved as ResolutionApprovedEvent,
  ResolutionCreated as ResolutionCreatedEvent,
  ResolutionUpdated as ResolutionUpdatedEvent,
  ResolutionVoted as ResolutionVotedEvent
} from "../generated/ResolutionMock/ResolutionMock"
import {
  DelegateLostVotingPower,
  ResolutionApproved,
  ResolutionCreated,
  ResolutionUpdated,
  ResolutionVoted
} from "../generated/schema"

export function handleDelegateLostVotingPower(
  event: DelegateLostVotingPowerEvent
): void {
  let entity = new DelegateLostVotingPower(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.resolutionId = event.params.resolutionId
  entity.amount = event.params.amount
  entity.save()
}

export function handleResolutionApproved(event: ResolutionApprovedEvent): void {
  let entity = new ResolutionApproved(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.resolutionId = event.params.resolutionId
  entity.save()
}

export function handleResolutionCreated(event: ResolutionCreatedEvent): void {
  let entity = new ResolutionCreated(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.resolutionId = event.params.resolutionId
  entity.save()
}

export function handleResolutionUpdated(event: ResolutionUpdatedEvent): void {
  let entity = new ResolutionUpdated(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.resolutionId = event.params.resolutionId
  entity.save()
}

export function handleResolutionVoted(event: ResolutionVotedEvent): void {
  let entity = new ResolutionVoted(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.resolutionId = event.params.resolutionId
  entity.votingPower = event.params.votingPower
  entity.isYes = event.params.isYes
  entity.save()
}
