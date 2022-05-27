// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class ResolutionVoter extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("votingPower", Value.fromBigInt(BigInt.zero()));
    this.set("address", Value.fromBytes(Bytes.empty()));
    this.set("hasVoted", Value.fromBoolean(false));
    this.set("hasVotedYes", Value.fromBoolean(false));
    this.set("delegated", Value.fromBytes(Bytes.empty()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ResolutionVoter entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save ResolutionVoter entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("ResolutionVoter", id.toString(), this);
    }
  }

  static load(id: string): ResolutionVoter | null {
    return changetype<ResolutionVoter | null>(store.get("ResolutionVoter", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get votingPower(): BigInt {
    let value = this.get("votingPower");
    return value!.toBigInt();
  }

  set votingPower(value: BigInt) {
    this.set("votingPower", Value.fromBigInt(value));
  }

  get address(): Bytes {
    let value = this.get("address");
    return value!.toBytes();
  }

  set address(value: Bytes) {
    this.set("address", Value.fromBytes(value));
  }

  get hasVoted(): boolean {
    let value = this.get("hasVoted");
    return value!.toBoolean();
  }

  set hasVoted(value: boolean) {
    this.set("hasVoted", Value.fromBoolean(value));
  }

  get hasVotedYes(): boolean {
    let value = this.get("hasVotedYes");
    return value!.toBoolean();
  }

  set hasVotedYes(value: boolean) {
    this.set("hasVotedYes", Value.fromBoolean(value));
  }

  get delegated(): Bytes {
    let value = this.get("delegated");
    return value!.toBytes();
  }

  set delegated(value: Bytes) {
    this.set("delegated", Value.fromBytes(value));
  }
}

export class ResolutionType extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("name", Value.fromString(""));
    this.set("quorum", Value.fromBigInt(BigInt.zero()));
    this.set("noticePeriod", Value.fromBigInt(BigInt.zero()));
    this.set("votingPeriod", Value.fromBigInt(BigInt.zero()));
    this.set("canBeNegative", Value.fromBoolean(false));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ResolutionType entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save ResolutionType entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("ResolutionType", id.toString(), this);
    }
  }

  static load(id: string): ResolutionType | null {
    return changetype<ResolutionType | null>(store.get("ResolutionType", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string {
    let value = this.get("name");
    return value!.toString();
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get quorum(): BigInt {
    let value = this.get("quorum");
    return value!.toBigInt();
  }

  set quorum(value: BigInt) {
    this.set("quorum", Value.fromBigInt(value));
  }

  get noticePeriod(): BigInt {
    let value = this.get("noticePeriod");
    return value!.toBigInt();
  }

  set noticePeriod(value: BigInt) {
    this.set("noticePeriod", Value.fromBigInt(value));
  }

  get votingPeriod(): BigInt {
    let value = this.get("votingPeriod");
    return value!.toBigInt();
  }

  set votingPeriod(value: BigInt) {
    this.set("votingPeriod", Value.fromBigInt(value));
  }

  get canBeNegative(): boolean {
    let value = this.get("canBeNegative");
    return value!.toBoolean();
  }

  set canBeNegative(value: boolean) {
    this.set("canBeNegative", Value.fromBoolean(value));
  }
}

export class Resolution extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("snapshotId", Value.fromBigInt(BigInt.zero()));
    this.set("ipfsDataURI", Value.fromString(""));
    this.set("isNegative", Value.fromBoolean(false));
    this.set("yesVotesTotal", Value.fromBigInt(BigInt.zero()));
    this.set("resolutionType", Value.fromString(""));
    this.set("createTimestamp", Value.fromBigInt(BigInt.zero()));
    this.set("updateTimestamp", Value.fromBigInt(BigInt.zero()));
    this.set("approveTimestamp", Value.fromBigInt(BigInt.zero()));
    this.set("createBy", Value.fromBytes(Bytes.empty()));
    this.set("voters", Value.fromStringArray(new Array(0)));
    this.set("hasQuorum", Value.fromBoolean(false));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Resolution entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Resolution entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Resolution", id.toString(), this);
    }
  }

  static load(id: string): Resolution | null {
    return changetype<Resolution | null>(store.get("Resolution", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get snapshotId(): BigInt {
    let value = this.get("snapshotId");
    return value!.toBigInt();
  }

  set snapshotId(value: BigInt) {
    this.set("snapshotId", Value.fromBigInt(value));
  }

  get ipfsDataURI(): string {
    let value = this.get("ipfsDataURI");
    return value!.toString();
  }

  set ipfsDataURI(value: string) {
    this.set("ipfsDataURI", Value.fromString(value));
  }

  get title(): string | null {
    let value = this.get("title");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set title(value: string | null) {
    if (!value) {
      this.unset("title");
    } else {
      this.set("title", Value.fromString(<string>value));
    }
  }

  get content(): string | null {
    let value = this.get("content");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set content(value: string | null) {
    if (!value) {
      this.unset("content");
    } else {
      this.set("content", Value.fromString(<string>value));
    }
  }

  get isNegative(): boolean {
    let value = this.get("isNegative");
    return value!.toBoolean();
  }

  set isNegative(value: boolean) {
    this.set("isNegative", Value.fromBoolean(value));
  }

  get yesVotesTotal(): BigInt {
    let value = this.get("yesVotesTotal");
    return value!.toBigInt();
  }

  set yesVotesTotal(value: BigInt) {
    this.set("yesVotesTotal", Value.fromBigInt(value));
  }

  get resolutionType(): string {
    let value = this.get("resolutionType");
    return value!.toString();
  }

  set resolutionType(value: string) {
    this.set("resolutionType", Value.fromString(value));
  }

  get createTimestamp(): BigInt {
    let value = this.get("createTimestamp");
    return value!.toBigInt();
  }

  set createTimestamp(value: BigInt) {
    this.set("createTimestamp", Value.fromBigInt(value));
  }

  get updateTimestamp(): BigInt {
    let value = this.get("updateTimestamp");
    return value!.toBigInt();
  }

  set updateTimestamp(value: BigInt) {
    this.set("updateTimestamp", Value.fromBigInt(value));
  }

  get approveTimestamp(): BigInt {
    let value = this.get("approveTimestamp");
    return value!.toBigInt();
  }

  set approveTimestamp(value: BigInt) {
    this.set("approveTimestamp", Value.fromBigInt(value));
  }

  get createBy(): Bytes {
    let value = this.get("createBy");
    return value!.toBytes();
  }

  set createBy(value: Bytes) {
    this.set("createBy", Value.fromBytes(value));
  }

  get updateBy(): Bytes | null {
    let value = this.get("updateBy");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set updateBy(value: Bytes | null) {
    if (!value) {
      this.unset("updateBy");
    } else {
      this.set("updateBy", Value.fromBytes(<Bytes>value));
    }
  }

  get approveBy(): Bytes | null {
    let value = this.get("approveBy");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set approveBy(value: Bytes | null) {
    if (!value) {
      this.unset("approveBy");
    } else {
      this.set("approveBy", Value.fromBytes(<Bytes>value));
    }
  }

  get voters(): Array<string> {
    let value = this.get("voters");
    return value!.toStringArray();
  }

  set voters(value: Array<string>) {
    this.set("voters", Value.fromStringArray(value));
  }

  get hasQuorum(): boolean {
    let value = this.get("hasQuorum");
    return value!.toBoolean();
  }

  set hasQuorum(value: boolean) {
    this.set("hasQuorum", Value.fromBoolean(value));
  }
}

export class DelegationUser extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("address", Value.fromBytes(Bytes.empty()));
    this.set("delegated", Value.fromBytes(Bytes.empty()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save DelegationUser entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save DelegationUser entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("DelegationUser", id.toString(), this);
    }
  }

  static load(id: string): DelegationUser | null {
    return changetype<DelegationUser | null>(store.get("DelegationUser", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get address(): Bytes {
    let value = this.get("address");
    return value!.toBytes();
  }

  set address(value: Bytes) {
    this.set("address", Value.fromBytes(value));
  }

  get delegated(): Bytes {
    let value = this.get("delegated");
    return value!.toBytes();
  }

  set delegated(value: Bytes) {
    this.set("delegated", Value.fromBytes(value));
  }
}

export class Offer extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("from", Value.fromBytes(Bytes.empty()));
    this.set("amount", Value.fromBigInt(BigInt.zero()));
    this.set("expirationTimestamp", Value.fromBigInt(BigInt.zero()));
    this.set("createTimestamp", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Offer entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Offer entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Offer", id.toString(), this);
    }
  }

  static load(id: string): Offer | null {
    return changetype<Offer | null>(store.get("Offer", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get from(): Bytes {
    let value = this.get("from");
    return value!.toBytes();
  }

  set from(value: Bytes) {
    this.set("from", Value.fromBytes(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value!.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }

  get expirationTimestamp(): BigInt {
    let value = this.get("expirationTimestamp");
    return value!.toBigInt();
  }

  set expirationTimestamp(value: BigInt) {
    this.set("expirationTimestamp", Value.fromBigInt(value));
  }

  get createTimestamp(): BigInt {
    let value = this.get("createTimestamp");
    return value!.toBigInt();
  }

  set createTimestamp(value: BigInt) {
    this.set("createTimestamp", Value.fromBigInt(value));
  }
}

export class DaoUser extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("address", Value.fromBytes(Bytes.empty()));
    this.set("totalBalance", Value.fromBigInt(BigInt.zero()));
    this.set("vestingBalance", Value.fromBigInt(BigInt.zero()));
    this.set("unlockedTempBalance", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save DaoUser entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save DaoUser entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("DaoUser", id.toString(), this);
    }
  }

  static load(id: string): DaoUser | null {
    return changetype<DaoUser | null>(store.get("DaoUser", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get address(): Bytes {
    let value = this.get("address");
    return value!.toBytes();
  }

  set address(value: Bytes) {
    this.set("address", Value.fromBytes(value));
  }

  get totalBalance(): BigInt {
    let value = this.get("totalBalance");
    return value!.toBigInt();
  }

  set totalBalance(value: BigInt) {
    this.set("totalBalance", Value.fromBigInt(value));
  }

  get vestingBalance(): BigInt {
    let value = this.get("vestingBalance");
    return value!.toBigInt();
  }

  set vestingBalance(value: BigInt) {
    this.set("vestingBalance", Value.fromBigInt(value));
  }

  get unlockedTempBalance(): BigInt {
    let value = this.get("unlockedTempBalance");
    return value!.toBigInt();
  }

  set unlockedTempBalance(value: BigInt) {
    this.set("unlockedTempBalance", Value.fromBigInt(value));
  }
}

export class DaoManager extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("contributorsAddresses", Value.fromBytesArray(new Array(0)));
    this.set("managingBoardAddresses", Value.fromBytesArray(new Array(0)));
    this.set("shareholdersAddresses", Value.fromBytesArray(new Array(0)));
    this.set("investorsAddresses", Value.fromBytesArray(new Array(0)));
    this.set("resolutionTypes", Value.fromStringArray(new Array(0)));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save DaoManager entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save DaoManager entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("DaoManager", id.toString(), this);
    }
  }

  static load(id: string): DaoManager | null {
    return changetype<DaoManager | null>(store.get("DaoManager", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get contributorsAddresses(): Array<Bytes> {
    let value = this.get("contributorsAddresses");
    return value!.toBytesArray();
  }

  set contributorsAddresses(value: Array<Bytes>) {
    this.set("contributorsAddresses", Value.fromBytesArray(value));
  }

  get managingBoardAddresses(): Array<Bytes> {
    let value = this.get("managingBoardAddresses");
    return value!.toBytesArray();
  }

  set managingBoardAddresses(value: Array<Bytes>) {
    this.set("managingBoardAddresses", Value.fromBytesArray(value));
  }

  get shareholdersAddresses(): Array<Bytes> {
    let value = this.get("shareholdersAddresses");
    return value!.toBytesArray();
  }

  set shareholdersAddresses(value: Array<Bytes>) {
    this.set("shareholdersAddresses", Value.fromBytesArray(value));
  }

  get investorsAddresses(): Array<Bytes> {
    let value = this.get("investorsAddresses");
    return value!.toBytesArray();
  }

  set investorsAddresses(value: Array<Bytes>) {
    this.set("investorsAddresses", Value.fromBytesArray(value));
  }

  get resolutionTypes(): Array<string> {
    let value = this.get("resolutionTypes");
    return value!.toStringArray();
  }

  set resolutionTypes(value: Array<string>) {
    this.set("resolutionTypes", Value.fromStringArray(value));
  }
}
