class Contract {
  contructor(
    secondPartyName,
    brideName,
    groomName,
    eventType,
    eventLocation,
    eventDate,
    civilID,
    phone1,
    phone2,
    contractStatus,
    price,
    photographer,
    video,
    packageID,
    componentIDs,
    contractStage,
    comments
  ) {
    this.secondPartyName = secondPartyName;
    this.brideName = brideName;
    this.groomName = groomName;
    this.eventType = eventType;
    this.eventLocation = eventLocation;
    this.eventDate = eventDate;
    this.civilID = civilID;
    this.phone1 = phone1;
    this.phone2 = phone2;
    this.contractStatus = contractStatus;
    this.price = price;
    this.photographer = photographer;
    this.video = video;
    this.packageID = packageID;
    this.componentIDs = componentIDs;
    this.contractStage = contractStage;
    this.comments = comments;
  }
}
