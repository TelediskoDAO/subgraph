import { BigInt, Bytes, ipfs, json, log, Address } from '@graphprotocol/graph-ts';

import { Resolution, ResolutionManager as ResolutionManagerEntity, ResolutionVoter, ResolutionType } from '../generated/schema';
import { ResolutionManager__resolutionsResult } from '../generated/ResolutionManager/ResolutionManager';
import {
  ResolutionManager,
  ResolutionApproved,
  ResolutionCreated,
  ResolutionUpdated,
  ResolutionVoted,
  ResolutionTypeCreated
} from "../generated/ResolutionManager/ResolutionManager"

export const RESOLUTION_MANAGER_ID = '0'

const setValuesFromResolutionContract = (resolutionEntity: Resolution, blockChainResolution: ResolutionManager__resolutionsResult): void => {
  const ipfsDataURI = blockChainResolution.value0
  const resolutionTypeEntity = ResolutionType.load(blockChainResolution.value1.toString()) as ResolutionType

  resolutionEntity.resolutionType = resolutionTypeEntity.id
  resolutionEntity.yesVotesTotal = blockChainResolution.value4
  resolutionEntity.isNegative = blockChainResolution.value5
  resolutionEntity.ipfsDataURI = ipfsDataURI

  // get other resolution data living on ipfs
  const ipfsRawData = ipfs.cat(ipfsDataURI)
  if (!ipfsRawData) {
    log.error('No ipfs raw data found for resolution {} with ipfsDataURI {}', [resolutionEntity.id, ipfsDataURI])
    resolutionEntity.save()
    return
  }

  const ipfsData = json.fromBytes(ipfsRawData as Bytes).toObject()
  const title = ipfsData.get('title')
  const content = ipfsData.get('content')
  if (title) {
    resolutionEntity.title = title.toString()
  }
  if (content) {
    resolutionEntity.content = content.toString()
  }
  resolutionEntity.save()
}

export function handleResolutionApproved(event: ResolutionApproved): void {
  const resolutionManager = ResolutionManager.bind(event.address)
  const resolutionIdStringified = event.params.resolutionId.toString()
  const resolutionEntity = Resolution.load(resolutionIdStringified)

  if (resolutionEntity) {
    const blockChainResolution = resolutionManager.resolutions(event.params.resolutionId)
    resolutionEntity.approveTimestamp = blockChainResolution.value2
    resolutionEntity.save()
    return
  }

  log.error('Trying to approve non-existing resolution {}', [resolutionIdStringified])
}

export function handleResolutionCreated(event: ResolutionCreated): void {
  const resolutionManager = ResolutionManager.bind(event.address)
  const resolutionIdStringified = event.params.resolutionId.toString()
  const resolutionEntity = new Resolution(resolutionIdStringified)

  const resolutionVoter = new ResolutionVoter(resolutionIdStringified + '-' + event.transaction.from.toHexString())
  resolutionVoter.votingPower = BigInt.fromI32(12)
  resolutionVoter.address = event.transaction.from
  resolutionVoter.save()
  resolutionEntity.voters = [resolutionVoter.id]

  const resolutionManagerEntity = getResolutionManagerEntity()
  const possibleVotersIds: string[] = []

  for (let index = 0; index < resolutionManagerEntity.contributorsAddresses.length; index++) {
    const voterAddress = resolutionManagerEntity.contributorsAddresses[index];
    const result = resolutionManager.try_getVoterVote(event.params.resolutionId, Address.fromString(voterAddress.toHex()))
    if (!result.reverted) {
      const resolutionVoter = new ResolutionVoter(resolutionIdStringified + '-' + voterAddress.toHexString())
      resolutionVoter.votingPower = result.value.value2
      resolutionVoter.address = voterAddress
      resolutionVoter.save()
      possibleVotersIds.push(resolutionVoter.id)
    }
  }

  if (possibleVotersIds.length > 0) {
    resolutionEntity.voters = possibleVotersIds
  }

  const blockChainResolution = resolutionManager.resolutions(event.params.resolutionId)

  if (blockChainResolution) {
    resolutionEntity.createTimestamp = event.block.timestamp
    resolutionEntity.createBy = event.transaction.from
  
    setValuesFromResolutionContract(resolutionEntity, blockChainResolution)
    return
  }
  log.error('No blockchain resolution found {}', [resolutionIdStringified])
}

export function handleResolutionUpdated(event: ResolutionUpdated): void {
  const resolutionManager = ResolutionManager.bind(event.address)
  const resolutionIdStringified = event.params.resolutionId.toString()
  const resolutionEntity = Resolution.load(resolutionIdStringified)
  
  if (resolutionEntity) {
    resolutionEntity.updateTimestamp = event.block.timestamp
    setValuesFromResolutionContract(resolutionEntity, resolutionManager.resolutions(event.params.resolutionId))
    return
  }

  log.error('Trying to update non-existing resolution {}', [resolutionIdStringified])
}

export function handleResolutionVoted(event: ResolutionVoted): void {}

export function handleResolutionTypeCreated(event: ResolutionTypeCreated): void {
  const resolutionManagerEntity = getResolutionManagerEntity()
  if (resolutionManagerEntity) {
    const newResolutionTypeEntity = new ResolutionType(event.params.typeIndex.toString())
    
    const resolutionManager = ResolutionManager.bind(event.address)
    const resolutionType = resolutionManager.resolutionTypes(event.params.typeIndex)
  
    newResolutionTypeEntity.name = resolutionType.value0
    newResolutionTypeEntity.quorum = resolutionType.value1
    newResolutionTypeEntity.noticePeriod = resolutionType.value2
    newResolutionTypeEntity.votingPeriod = resolutionType.value3
    newResolutionTypeEntity.canBeNegative = resolutionType.value4
  
    resolutionManagerEntity.resolutionTypes = resolutionManagerEntity.resolutionTypes.concat([newResolutionTypeEntity.id])
    resolutionManagerEntity.save()
    newResolutionTypeEntity.save()
  }
}

export function getResolutionManagerEntity(): ResolutionManagerEntity {
  const resolutionManagerEntity = ResolutionManagerEntity.load(RESOLUTION_MANAGER_ID) || new ResolutionManagerEntity(RESOLUTION_MANAGER_ID)

  return resolutionManagerEntity as ResolutionManagerEntity
}