import { BigInt, Bytes, ipfs, json, log } from '@graphprotocol/graph-ts';

import { Resolution } from '../generated/schema';
import {
  ResolutionManager,
  ResolutionApproved,
  ResolutionCreated,
  ResolutionUpdated,
  ResolutionVoted
} from "../generated/ResolutionManager/ResolutionManager"

const setValuesFromResolutionContract = (resolutionManager: ResolutionManager, resolutionId: BigInt): void => {
  const resolutionIdStringified = resolutionId.toString()
  const resolutionEntity = (Resolution.load(resolutionIdStringified) || new Resolution(resolutionIdStringified)) as Resolution
  
  // get resolution data from the blockchain
  const currentResolution = resolutionManager.resolutions(resolutionId)

  const ipfsDataURI = currentResolution.value0

  resolutionEntity.typeId = currentResolution.value1
  resolutionEntity.approveTimestamp = currentResolution.value2
  resolutionEntity.yesVotesTotal = currentResolution.value4
  resolutionEntity.isNegative = currentResolution.value5

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
    log.error('No ipfs data found for resolution {} with ipfsDataURI {}', [resolutionIdStringified, ipfsDataURI])
  }

  resolutionEntity.save()
}

export function handleResolutionApproved(event: ResolutionApproved): void {
  const resolutionManager = ResolutionManager.bind(event.address)
  const currentResolution = resolutionManager.resolutions(event.params.resolutionId)
  const approveTimestamp = currentResolution.value2
  const resolutionEntity = Resolution.load(event.params.resolutionId.toString())

  if (resolutionEntity) {
    resolutionEntity.approveTimestamp = approveTimestamp
    resolutionEntity.save()
  }
}

export function handleResolutionCreated(event: ResolutionCreated): void {
  setValuesFromResolutionContract(ResolutionManager.bind(event.address), event.params.resolutionId)
}

export function handleResolutionUpdated(event: ResolutionUpdated): void {
  setValuesFromResolutionContract(ResolutionManager.bind(event.address), event.params.resolutionId)
}

export function handleResolutionVoted(event: ResolutionVoted): void {}
