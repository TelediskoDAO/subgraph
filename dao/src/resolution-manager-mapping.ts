import {
  Bytes,
  ipfs,
  json,
  log,
  Address,
  BigInt,
} from "@graphprotocol/graph-ts";

import {
  Resolution,
  ResolutionVoter,
  ResolutionType,
} from "../generated/schema";
import {
  ResolutionManager__resolutionsResult,
  ResolutionManager__getExecutionDetailsResult,
} from "../generated/ResolutionManager/ResolutionManager";
import { Voting } from "../generated/Voting/Voting";
import {
  ResolutionManager,
  ResolutionApproved,
  ResolutionCreated,
  ResolutionUpdated,
  ResolutionVoted,
  ResolutionTypeCreated,
} from "../generated/ResolutionManager/ResolutionManager";
import { getDaoManagerEntity } from "./dao-manager";
import {
  ResolutionExecuted,
  ResolutionRejected,
} from "../generated/ResolutionManager/ResolutionManager";

const VOTING_CONTRACT_ADDRESS = "0x5cd92eC33a70b017744eBf87205Ec186c9A4d8cD";

const setValuesFromResolutionContract = (
  resolutionEntity: Resolution,
  blockChainResolution: ResolutionManager__resolutionsResult,
  executionDetails: ResolutionManager__getExecutionDetailsResult
): void => {
  const ipfsDataURI = blockChainResolution.value0;
  const resolutionTypeEntity = ResolutionType.load(
    blockChainResolution.value1.toString()
  ) as ResolutionType;

  resolutionEntity.resolutionType = resolutionTypeEntity.id;
  resolutionEntity.yesVotesTotal = blockChainResolution.value4;
  resolutionEntity.isNegative = blockChainResolution.value5;
  resolutionEntity.ipfsDataURI = ipfsDataURI;
  const executionTo: Bytes[] = [];
  for (let index = 0; index < executionDetails.value0.length; index++) {
    // this is needed as you can't assign an Address[] to a Bytes[] directly, you need to first create Bytes[]
    const current = executionDetails.value0[index];
    executionTo.push(current);
  }
  resolutionEntity.executionTo = executionTo;
  resolutionEntity.executionData = executionDetails.value1;

  // get other resolution data living on ipfs
  const ipfsRawData = ipfs.cat(ipfsDataURI);
  if (!ipfsRawData) {
    log.error("No ipfs raw data found for resolution {} with ipfsDataURI {}", [
      resolutionEntity.id,
      ipfsDataURI,
    ]);
    resolutionEntity.save();
    return;
  }

  const ipfsData = json.fromBytes(ipfsRawData as Bytes).toObject();
  const title = ipfsData.get("title");
  const content = ipfsData.get("content");
  if (title) {
    resolutionEntity.title = title.toString();
  }
  if (content) {
    resolutionEntity.content = content.toString();
  }
  resolutionEntity.save();
};

export function handleResolutionApproved(event: ResolutionApproved): void {
  const resolutionManager = ResolutionManager.bind(event.address);
  const resolutionIdStringified = event.params.resolutionId.toString();
  const resolutionEntity = Resolution.load(resolutionIdStringified);

  const voting = Voting.bind(Address.fromString(VOTING_CONTRACT_ADDRESS));

  if (resolutionEntity) {
    const daoManagerEntity = getDaoManagerEntity();
    const possibleVotersIds: string[] = [];
    const blockChainResolution = resolutionManager.resolutions(
      event.params.resolutionId
    );
    resolutionEntity.approveTimestamp = blockChainResolution.value2;
    resolutionEntity.approveBy = event.transaction.from;
    resolutionEntity.snapshotId = blockChainResolution.value3;

    for (
      let index = 0;
      index < daoManagerEntity.contributorsAddresses.length;
      index++
    ) {
      const voterAddress = daoManagerEntity.contributorsAddresses[index];
      const result = resolutionManager.try_getVoterVote(
        event.params.resolutionId,
        Address.fromString(voterAddress.toHex())
      );
      if (!result.reverted) {
        const resolutionVoter = new ResolutionVoter(
          resolutionIdStringified + "-" + voterAddress.toHexString()
        );
        resolutionVoter.votingPower = result.value.value2;
        resolutionVoter.address = voterAddress;
        resolutionVoter.hasVoted = false;
        resolutionVoter.hasVotedYes = false;
        const maybeDelegated = voting.try_getDelegateAt(
          Address.fromString(voterAddress.toHex()),
          resolutionEntity.snapshotId
        );
        if (!maybeDelegated.reverted) {
          const delegatedAddress = maybeDelegated.value;
          resolutionVoter.delegated = delegatedAddress;
        } else {
          resolutionVoter.delegated = voterAddress;
        }
        resolutionVoter.save();
        possibleVotersIds.push(resolutionVoter.id);
      } else {
        log.warning("Tried getVoterVote for address {} but failed", [
          voterAddress.toHexString(),
        ]);
      }
    }

    if (possibleVotersIds.length > 0) {
      resolutionEntity.voters = possibleVotersIds;
    }

    resolutionEntity.save();
    return;
  }

  log.error("Trying to approve non-existing resolution {}", [
    resolutionIdStringified,
  ]);
}

export function handleResolutionCreated(event: ResolutionCreated): void {
  const resolutionManager = ResolutionManager.bind(event.address);
  const resolutionIdStringified = event.params.resolutionId.toString();
  const resolutionEntity = new Resolution(resolutionIdStringified);

  const blockChainResolution = resolutionManager.resolutions(
    event.params.resolutionId
  );

  if (blockChainResolution) {
    resolutionEntity.createTimestamp = event.block.timestamp;
    resolutionEntity.createBy = event.transaction.from;

    setValuesFromResolutionContract(
      resolutionEntity,
      blockChainResolution,
      resolutionManager.getExecutionDetails(event.params.resolutionId)
    );
    return;
  }
  log.error("No blockchain resolution found {}", [resolutionIdStringified]);
}

export function handleResolutionUpdated(event: ResolutionUpdated): void {
  const resolutionManager = ResolutionManager.bind(event.address);
  const resolutionIdStringified = event.params.resolutionId.toString();
  const resolutionEntity = Resolution.load(resolutionIdStringified);

  if (resolutionEntity) {
    resolutionEntity.updateTimestamp = event.block.timestamp;
    resolutionEntity.updateBy = event.transaction.from;
    setValuesFromResolutionContract(
      resolutionEntity,
      resolutionManager.resolutions(event.params.resolutionId),
      resolutionManager.getExecutionDetails(event.params.resolutionId)
    );
    return;
  }

  log.error("Trying to update non-existing resolution {}", [
    resolutionIdStringified,
  ]);
}

export function handleResolutionExecuted(event: ResolutionExecuted): void {
  const resolutionManager = ResolutionManager.bind(event.address);
  const resolutionIdStringified = event.params.resolutionId.toString();
  const resolutionEntity = Resolution.load(resolutionIdStringified);

  if (resolutionEntity) {
    const blockChainResolution = resolutionManager.resolutions(
      event.params.resolutionId
    );
    resolutionEntity.executionTimestamp = blockChainResolution.value6;
    resolutionEntity.save();
    return;
  }

  log.error("Trying to set executed to a non-existing resolution {}", [
    resolutionIdStringified,
  ]);
}

export function handleResolutionVoted(event: ResolutionVoted): void {
  const resolutionManager = ResolutionManager.bind(event.address);
  const resolutionId = event.params.resolutionId;
  const voterAddress = event.params.from;

  const resolutionIdStringified = resolutionId.toString();
  const resolutionVoterId =
    resolutionIdStringified + "-" + voterAddress.toHexString();

  const resolutionEntity = Resolution.load(resolutionIdStringified);
  const snapshotId = resolutionEntity
    ? resolutionEntity.snapshotId
    : BigInt.fromI32(0);

  if (resolutionEntity) {
    resolutionEntity.hasQuorum = resolutionManager.getResolutionResult(
      resolutionId
    );
    resolutionEntity.save();
  }

  const resolutionVoter = ResolutionVoter.load(resolutionVoterId);
  if (resolutionVoter) {
    resolutionVoter.hasVoted = true;
    resolutionVoter.hasVotedYes = event.params.isYes;
  }

  const voting = Voting.bind(Address.fromString(VOTING_CONTRACT_ADDRESS));

  const maybeDelegated = voting.try_getDelegateAt(voterAddress, snapshotId);

  if (!maybeDelegated.reverted) {
    const delegatedAddress = maybeDelegated.value;
    log.info(
      "DelegatedAddress: {}, VoterAddress: {}, Resolution Id: {}, Snapshot Id: {}",
      [
        delegatedAddress.toHexString(),
        voterAddress.toHexString(),
        resolutionIdStringified,
        snapshotId.toString(),
      ]
    );

    if (delegatedAddress != voterAddress) {
      const resultForVoter = resolutionManager.try_getVoterVote(
        resolutionId,
        voterAddress
      );
      if (!resultForVoter.reverted && resolutionVoter) {
        resolutionVoter.votingPower = resultForVoter.value.value2;
      }

      const resultForDelegated = resolutionManager.try_getVoterVote(
        resolutionId,
        delegatedAddress
      );
      const resolutionVoterDelegated = ResolutionVoter.load(
        resolutionIdStringified + "-" + delegatedAddress.toHexString()
      );
      if (!resultForDelegated.reverted && resolutionVoterDelegated) {
        resolutionVoterDelegated.votingPower = resultForDelegated.value.value2;
        resolutionVoterDelegated.save();
      }
    }
  }

  if (resolutionVoter) {
    // if a resolution voter has voted, reset its delegated address
    resolutionVoter.delegated = voterAddress;
    resolutionVoter.save();
  }
}

export function handleResolutionRejected(event: ResolutionRejected): void {
  const resolutionIdStringified = event.params.resolutionId.toString();
  const resolutionEntity = Resolution.load(resolutionIdStringified);

  if (resolutionEntity) {
    resolutionEntity.rejectTimestamp = event.block.timestamp;
    resolutionEntity.rejectBy = event.transaction.from;

    resolutionEntity.save();
    return;
  }

  log.error("Trying to reject non-existing resolution {}", [
    resolutionIdStringified,
  ]);
}

export function handleResolutionTypeCreated(
  event: ResolutionTypeCreated
): void {
  const daoManagerEntity = getDaoManagerEntity();
  if (daoManagerEntity) {
    const newResolutionTypeEntity = new ResolutionType(
      event.params.typeIndex.toString()
    );

    const resolutionManager = ResolutionManager.bind(event.address);
    const resolutionType = resolutionManager.resolutionTypes(
      event.params.typeIndex
    );

    newResolutionTypeEntity.name = resolutionType.value0;
    newResolutionTypeEntity.quorum = resolutionType.value1;
    newResolutionTypeEntity.noticePeriod = resolutionType.value2;
    newResolutionTypeEntity.votingPeriod = resolutionType.value3;
    newResolutionTypeEntity.canBeNegative = resolutionType.value4;

    daoManagerEntity.resolutionTypes = daoManagerEntity.resolutionTypes.concat([
      newResolutionTypeEntity.id,
    ]);
    daoManagerEntity.save();
    newResolutionTypeEntity.save();
  }
}
