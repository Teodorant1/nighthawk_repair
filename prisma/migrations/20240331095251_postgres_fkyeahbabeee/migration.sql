-- CreateTable
CREATE TABLE "profileSubCategory" (
    "id" TEXT NOT NULL,
    "user_ID" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT NOT NULL,

    CONSTRAINT "profileSubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "ReviewerID" TEXT NOT NULL,
    "WorkerID" TEXT NOT NULL,
    "Job_Id" TEXT NOT NULL,
    "reviewText" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "user_ID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "Link" TEXT NOT NULL,
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workGalleryPicture" (
    "id" TEXT NOT NULL,
    "user_ID" TEXT NOT NULL,
    "cloudinaryID" TEXT NOT NULL,

    CONSTRAINT "workGalleryPicture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'user',
    "isClient" BOOLEAN NOT NULL DEFAULT false,
    "isRepairman" BOOLEAN NOT NULL DEFAULT false,
    "isProgrammer" BOOLEAN NOT NULL DEFAULT false,
    "phoneNum" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "coins" INTEGER NOT NULL DEFAULT 0,
    "distance" INTEGER,
    "TravelRange" INTEGER DEFAULT 0,
    "latitude" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "longitude" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "country" TEXT NOT NULL DEFAULT 'UK',
    "profilePic" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userNotificationConfig" (
    "id" TEXT NOT NULL,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT false,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "userNotificationConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryID" TEXT NOT NULL,

    CONSTRAINT "sub_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" TEXT NOT NULL,
    "text_Question" TEXT NOT NULL,
    "sub_categoryID" TEXT NOT NULL,
    "categoryID" TEXT NOT NULL,
    "isOptional" BOOLEAN NOT NULL,
    "answers" JSONB,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer" (
    "id" TEXT NOT NULL,
    "sub_categoryID" TEXT NOT NULL,
    "categoryID" TEXT NOT NULL,
    "questionID" TEXT NOT NULL,
    "text_answer" TEXT NOT NULL,
    "moneycost" INTEGER NOT NULL,
    "timecost" INTEGER NOT NULL,

    CONSTRAINT "answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submitted_job" (
    "id" TEXT NOT NULL,
    "sub_categoryID" TEXT NOT NULL,
    "categoryID" TEXT NOT NULL,
    "answeredQuestions" TEXT NOT NULL,
    "optional_answeredQuestions" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT false,
    "submittterEmail" TEXT NOT NULL,
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "extrainfo" TEXT,
    "timecost" INTEGER NOT NULL,
    "moneycost" INTEGER NOT NULL,
    "number_of_applications" INTEGER NOT NULL DEFAULT 0,
    "distance" INTEGER,
    "latitude" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "longitude" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "title" TEXT,
    "timing" TEXT,
    "hiringstage" TEXT,
    "first_to_buy" BOOLEAN DEFAULT false,
    "minBudget" INTEGER DEFAULT 0,
    "maxBudget" INTEGER DEFAULT 10000,
    "status" TEXT,
    "finalWorkerID" TEXT,
    "postalCode" TEXT NOT NULL DEFAULT 'defaultAddress',

    CONSTRAINT "submitted_job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPicture" (
    "id" TEXT NOT NULL,
    "cloudinaryID" TEXT NOT NULL,
    "submitted_jobId" TEXT NOT NULL,

    CONSTRAINT "JobPicture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appliedJob" (
    "id" TEXT NOT NULL,
    "submittedJob_ID" TEXT NOT NULL,
    "submitterEmail" TEXT NOT NULL,
    "status" TEXT,
    "userID" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appliedJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tradesmanCandidate" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "BusinessName" TEXT NOT NULL,
    "BusinessAddress" TEXT NOT NULL,
    "CompanyNumber" TEXT NOT NULL,
    "Approved" BOOLEAN NOT NULL DEFAULT false,
    "LiabilityLicenseLink" TEXT NOT NULL,

    CONSTRAINT "tradesmanCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tradesmanCandidateSubCategory" (
    "id" TEXT NOT NULL,
    "SubCategory" TEXT NOT NULL,
    "categoryID" TEXT NOT NULL,
    "tradesmanCandidateId" TEXT,

    CONSTRAINT "tradesmanCandidateSubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Review_Job_Id_key" ON "Review"("Job_Id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "userNotificationConfig_userId_key" ON "userNotificationConfig"("userId");

-- CreateIndex
CREATE INDEX "userNotificationConfig_userId_idx" ON "userNotificationConfig"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sub_category_name_key" ON "sub_category"("name");

-- CreateIndex
CREATE INDEX "JobPicture_submitted_jobId_idx" ON "JobPicture"("submitted_jobId");

-- CreateIndex
CREATE INDEX "tradesmanCandidateSubCategory_tradesmanCandidateId_idx" ON "tradesmanCandidateSubCategory"("tradesmanCandidateId");

-- AddForeignKey
ALTER TABLE "userNotificationConfig" ADD CONSTRAINT "userNotificationConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPicture" ADD CONSTRAINT "JobPicture_submitted_jobId_fkey" FOREIGN KEY ("submitted_jobId") REFERENCES "submitted_job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tradesmanCandidateSubCategory" ADD CONSTRAINT "tradesmanCandidateSubCategory_tradesmanCandidateId_fkey" FOREIGN KEY ("tradesmanCandidateId") REFERENCES "tradesmanCandidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
