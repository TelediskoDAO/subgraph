import { BigInt, Bytes, ipfs, json, log } from '@graphprotocol/graph-ts';

import { Resolution } from '../generated/schema';
import { ResolutionManager__resolutionsResult } from '../generated/ResolutionManager/ResolutionManager';
import {
  ResolutionManager,
  ResolutionApproved,
  ResolutionCreated,
  ResolutionUpdated,
  ResolutionVoted
} from "../generated/ResolutionManager/ResolutionManager"

const setValuesFromResolutionContract = (resolutionEntity: Resolution, blockChainResolution: ResolutionManager__resolutionsResult): void => {
  resolutionEntity.typeId = blockChainResolution.value1
  resolutionEntity.yesVotesTotal = blockChainResolution.value4
  resolutionEntity.isNegative = blockChainResolution.value5

  const ipfsDataURI = blockChainResolution.value0

  // get other resolution data living on ipfs
  const ipfsData = json.fromBytes(ipfs.cat(ipfsDataURI) as Bytes).toObject()
  if (ipfsData) {  
    const title = ipfsData.get('title')
    const content = ipfsData.get('content')
    if (title) {
      resolutionEntity.title = title.toString()
    }
    if (content) {
      resolutionEntity.content = content.toString()
    }
  } else {
    log.error('No ipfs data found for resolution {} with ipfsDataURI {}', [resolutionEntity.id, ipfsDataURI])
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
  resolutionEntity.createTimestamp = event.block.timestamp

  setValuesFromResolutionContract(resolutionEntity, resolutionManager.resolutions(event.params.resolutionId))
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
