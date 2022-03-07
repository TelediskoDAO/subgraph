import { Bytes, ipfs, json, log, Address } from '@graphprotocol/graph-ts';

import { Resolution, ResolutionManager as ResolutionManagerEntity, ResolutionVoter, ResolutionType } from '../generated/schema';
import { ResolutionManager__resolutionsResult } from '../generated/ResolutionManager/ResolutionManager';
import { Voting } from '../generated/Voting/Voting';
import {
  ResolutionManager,
  ResolutionApproved,
  ResolutionCreated,
  ResolutionUpdated,
  ResolutionVoted,
  ResolutionTypeCreated
} from "../generated/ResolutionManager/ResolutionManager"

export const RESOLUTION_MANAGER_ID = '0'
const VOTING_CONTRACT_ADDRESS = '0x698b17b48dccfe5d82aa287b0b87bffbd796cae2'

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
    const resolutionManagerEntity = getResolutionManagerEntity()
    const possibleVotersIds: string[] = []

    for (let index = 0; index < resolutionManagerEntity.contributorsAddresses.length; index++) {
      const voterAddress = resolutionManagerEntity.contributorsAddresses[index];
      const result = resolutionManager.try_getVoterVote(event.params.resolutionId, Address.fromString(voterAddress.toHex()))
      if (!result.reverted) {
        const resolutionVoter = new ResolutionVoter(resolutionIdStringified + '-' + voterAddress.toHexString())
        resolutionVoter.votingPower = result.value.value2
        resolutionVoter.address = voterAddress
        resolutionVoter.hasVoted = false
        resolutionVoter.hasVotedYes = false
        resolutionVoter.save()
        possibleVotersIds.push(resolutionVoter.id)
      } else {
        log.warning('Tried getVoterVote for address {} but failed', [voterAddress.toHexString()])
      }
    }

    if (possibleVotersIds.length > 0) {
      resolutionEntity.voters = possibleVotersIds
    }

    const blockChainResolution = resolutionManager.resolutions(event.params.resolutionId)
    resolutionEntity.approveTimestamp = blockChainResolution.value2
    resolutionEntity.approveBy = event.transaction.from
    resolutionEntity.save()
    return
  }

  log.error('Trying to approve non-existing resolution {}', [resolutionIdStringified])
}

export function handleResolutionCreated(event: ResolutionCreated): void {
  const resolutionManager = ResolutionManager.bind(event.address)
  const resolutionIdStringified = event.params.resolutionId.toString()
  const resolutionEntity = new Resolution(resolutionIdStringified)

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
    resolutionEntity.updateBy = event.transaction.from
    setValuesFromResolutionContract(resolutionEntity, resolutionManager.resolutions(event.params.resolutionId))
    return
  }

  log.error('Trying to update non-existing resolution {}', [resolutionIdStringified])
}

export function handleResolutionVoted(event: ResolutionVoted): void {
  const resolutionManager = ResolutionManager.bind(event.address)
  const resolutionId = event.params.resolutionId
  const voterAddress = event.params.from
  
  const resolutionIdStringified = resolutionId.toString()
  const resolutionVoterId = resolutionIdStringified + '-' + voterAddress.toHexString()
  
  const resolutionEntity = Resolution.load(resolutionIdStringified)

  if (resolutionEntity) {
    resolutionEntity.hasQuorum = resolutionManager.getResolutionResult(resolutionId)
    resolutionEntity.save()
  }

  const resolutionVoter = ResolutionVoter.load(resolutionVoterId)
  if (resolutionVoter) {
    resolutionVoter.hasVoted = true
    resolutionVoter.hasVotedYes = event.params.isYes
  }

  const voting = Voting.bind(Address.fromString(VOTING_CONTRACT_ADDRESS)) // todo getting this from resolution manager maybe?
  
  const maybeDelegated = voting.try_getDelegateAt(voterAddress, resolutionId)

  if (!maybeDelegated.reverted) {
    const delegatedAddress = maybeDelegated.value
    log.info('DelegatedAddress: {}, VoterAddress: {}, Resolution Id: {}', [delegatedAddress.toHexString(), voterAddress.toHexString(), resolutionIdStringified])

    if (delegatedAddress != voterAddress) {
      const resultForVoter = resolutionManager.try_getVoterVote(resolutionId, voterAddress)
      if (!resultForVoter.reverted && resolutionVoter) {
        resolutionVoter.votingPower = resultForVoter.value.value2
      }

      const resultForDelegated = resolutionManager.try_getVoterVote(resolutionId, delegatedAddress)
      const resolutionVoterDelegated = ResolutionVoter.load(resolutionIdStringified + '-' + delegatedAddress.toHexString())
      if (!resultForDelegated.reverted && resolutionVoterDelegated) {
        resolutionVoterDelegated.votingPower = resultForDelegated.value.value2
        resolutionVoterDelegated.save()
      }
    } 
  }

  if (resolutionVoter) {
    resolutionVoter.save()
  }
}

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
