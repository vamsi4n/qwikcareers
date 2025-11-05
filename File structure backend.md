├── src/
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   ├── controllers/
│   │   │   │   ├── auth.controller.js
│   │   │   │   ├── social-auth.controller.js
│   │   │   │   └── password.controller.js
│   │   │   ├── services/
│   │   │   │   ├── auth.service.js
│   │   │   │   ├── token.service.js
│   │   │   │   ├── session.service.js
│   │   │   │   └── oauth.service.js
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.js
│   │   │   │   ├── google.strategy.js
│   │   │   │   ├── linkedin.strategy.js
│   │   │   │   └── facebook.strategy.js
│   │   │   ├── middleware/
│   │   │   │   ├── authenticate.middleware.js
│   │   │   │   ├── authorize.middleware.js
│   │   │   │   └── verify-email.middleware.js
│   │   │   ├── validators/
│   │   │   │   ├── login.validator.js
│   │   │   │   ├── register.validator.js
│   │   │   │   └── password-reset.validator.js
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.js
│   │   │   │   ├── register.dto.js
│   │   │   │   └── token-response.dto.js
│   │   │   ├── transformers/
│   │   │   │   └── auth-response.transformer.js
│   │   │   ├── routes/
│   │   │   │   └── auth.routes.js
│   │   │   ├── models/
│   │   │   │   ├── RefreshToken.model.js
│   │   │   │   └── PasswordReset.model.js
│   │   │   ├── constants/
│   │   │   │   └── auth.constants.js
│   │   │   ├── tests/
│   │   │   │   ├── unit/
│   │   │   │   └── integration/
│   │   │   └── index.js
│   │   │
│   │   ├── users/
│   │   │   ├── controllers/
│   │   │   │   ├── user.controller.js
│   │   │   │   └── profile.controller.js
│   │   │   ├── services/
│   │   │   │   ├── user.service.js
│   │   │   │   ├── profile.service.js
│   │   │   │   └── avatar.service.js
│   │   │   ├── repositories/
│   │   │   │   └── user.repository.js
│   │   │   ├── validators/
│   │   │   │   ├── user.validator.js
│   │   │   │   └── profile.validator.js
│   │   │   ├── dto/
│   │   │   │   ├── user.dto.js
│   │   │   │   └── profile.dto.js
│   │   │   ├── transformers/
│   │   │   │   ├── user.transformer.js
│   │   │   │   └── profile.transformer.js
│   │   │   ├── routes/
│   │   │   │   └── user.routes.js
│   │   │   ├── models/
│   │   │   │   ├── User.model.js
│   │   │   │   └── UserSettings.model.js
│   │   │   ├── middleware/
│   │   │   │   └── user-ownership.middleware.js
│   │   │   ├── constants/
│   │   │   │   └── user.constants.js
│   │   │   ├── tests/
│   │   │   └── index.js
│   │   │
│   │   ├── jobseekers/
│   │   │   ├── controllers/
│   │   │   │   ├── jobseeker.controller.js
│   │   │   │   ├── jobseeker-profile.controller.js
│   │   │   │   ├── experience.controller.js
│   │   │   │   ├── education.controller.js
│   │   │   │   ├── skills.controller.js
│   │   │   │   ├── certifications.controller.js
│   │   │   │   └── portfolio.controller.js
│   │   │   ├── services/
│   │   │   │   ├── jobseeker.service.js
│   │   │   │   ├── profile-completeness.service.js
│   │   │   │   ├── profile-strength.service.js
│   │   │   │   └── preference.service.js
│   │   │   ├── repositories/
│   │   │   │   ├── jobseeker.repository.js
│   │   │   │   ├── experience.repository.js
│   │   │   │   └── education.repository.js
│   │   │   ├── validators/
│   │   │   │   ├── profile.validator.js
│   │   │   │   ├── experience.validator.js
│   │   │   │   └── education.validator.js
│   │   │   ├── dto/
│   │   │   ├── transformers/
│   │   │   ├── routes/
│   │   │   │   └── jobseeker.routes.js
│   │   │   ├── models/
│   │   │   │   ├── JobSeeker.model.js
│   │   │   │   ├── Experience.model.js
│   │   │   │   ├── Education.model.js
│   │   │   │   ├── Skill.model.js
│   │   │   │   ├── Certification.model.js
│   │   │   │   ├── Portfolio.model.js
│   │   │   │   └── JobSeekerPreference.model.js
│   │   │   ├── constants/
│   │   │   ├── tests/
│   │   │   └── index.js
│   │   │
│   │   ├── employers/
│   │   │   ├── controllers/
│   │   │   │   ├── employer.controller.js
│   │   │   │   ├── employer-profile.controller.js
│   │   │   │   └── employer-team.controller.js
│   │   │   ├── services/
│   │   │   │   ├── employer.service.js
│   │   │   │   ├── employer-verification.service.js
│   │   │   │   └── team-management.service.js
│   │   │   ├── repositories/
│   │   │   │   └── employer.repository.js
│   │   │   ├── validators/
│   │   │   ├── dto/
│   │   │   ├── transformers/
│   │   │   ├── routes/
│   │   │   │   └── employer.routes.js
│   │   │   ├── models/
│   │   │   │   ├── Employer.model.js
│   │   │   │   └── EmployerTeamMember.model.js
│   │   │   ├── middleware/
│   │   │   │   └── employer-verification.middleware.js
│   │   │   ├── constants/
│   │   │   ├── tests/
│   │   │   └── index.js
│   │   │
│   │   ├── companies/
│   │   │   ├── controllers/
│   │   │   │   ├── company.controller.js
│   │   │   │   ├── company-profile.controller.js
│   │   │   │   └── company-followers.controller.js
│   │   │   ├── services/
│   │   │   │   ├── company.service.js
│   │   │   │   ├── company-verification.service.js
│   │   │   │   └── company-analytics.service.js
│   │   │   ├── repositories/
│   │   │   │   └── company.repository.js
│   │   │   ├── validators/
│   │   │   ├── dto/
│   │   │   ├── transformers/
│   │   │   ├── routes/
│   │   │   │   └── company.routes.js
│   │   │   ├── models/
│   │   │   │   ├── Company.model.js
│   │   │   │   ├── CompanyFollower.model.js
│   │   │   │   └── CompanyMedia.model.js
│   │   │   ├── constants/
│   │   │   ├── tests/
│   │   │   └── index.js
│   │   │
│   │   ├── jobs/
│   │   │   ├── controllers/
│   │   │   │   ├── job.controller.js
│   │   │   │   ├── job-management.controller.js
│   │   │   │   ├── saved-jobs.controller.js
│   │   │   │   └── job-alerts.controller.js
│   │   │   ├── services/
│   │   │   │   ├── job.service.js
│   │   │   │   ├── job-creation.service.js
│   │   │   │   ├── job-update.service.js
│   │   │   │   ├── job-validation.service.js
│   │   │   │   ├── job-expiry.service.js
│   │   │   │   ├── saved-jobs.service.js
│   │   │   │   ├── job-alerts.service.js
│   │   │   │   └── featured-jobs.service.js
│   │   │   ├── repositories/
│   │   │   │   ├── job.repository.js
│   │   │   │   ├── saved-job.repository.js
│   │   │   │   └── job-alert.repository.js
│   │   │   ├── validators/
│   │   │   │   ├── create-job.validator.js
│   │   │   │   ├── update-job.validator.js
│   │   │   │   └── job-alert.validator.js
│   │   │   ├── dto/
│   │   │   ├── transformers/
│   │   │   │   ├── job.transformer.js
│   │   │   │   └── job-list.transformer.js
│   │   │   ├── routes/
│   │   │   │   ├── job.routes.js
│   │   │   │   ├── saved-jobs.routes.js
│   │   │   │   └── job-alerts.routes.js
│   │   │   ├── models/
│   │   │   │   ├── Job.model.js
│   │   │   │   ├── SavedJob.model.js
│   │   │   │   ├── JobAlert.model.js
│   │   │   │   └── JobView.model.js
│   │   │   ├── middleware/
│   │   │   │   ├── job-ownership.middleware.js
│   │   │   │   └── job-status.middleware.js
│   │   │   ├── subscribers/
│   │   │   │   ├── job-created.subscriber.js
│   │   │   │   ├── job-updated.subscriber.js
│   │   │   │   ├── job-closed.subscriber.js
│   │   │   │   └── job-expired.subscriber.js
│   │   │   ├── constants/
│   │   │   │   └── job.constants.js
│   │   │   ├── tests/
│   │   │   └── index.js
│   │   │
│   │   ├── applications/
│   │   │   ├── controllers/
│   │   │   │   ├── application.controller.js
│   │   │   │   ├── application-tracking.controller.js
│   │   │   │   └── bulk-application.controller.js
│   │   │   ├── services/
│   │   │   │   ├── application.service.js
│   │   │   │   ├── application-submission.service.js
│   │   │   │   ├── application-tracking.service.js
│   │   │   │   ├── application-status.service.js
│   │   │   │   ├── screening.service.js
│   │   │   │   └── interview-scheduling.service.js
│   │   │   ├── repositories/
│   │   │   │   └── application.repository.js
│   │   │   ├── validators/
│   │   │   │   └── application.validator.js
│   │   │   ├── dto/
│   │   │   ├── transformers/
│   │   │   ├── routes/
│   │   │   │   └── application.routes.js
│   │   │   ├── models/
│   │   │   │   ├── Application.model.js
│   │   │   │   ├── ApplicationStage.model.js
│   │   │   │   ├── ApplicationNote.model.js
│   │   │   │   └── Interview.model.js
│   │   │   ├── middleware/
│   │   │   │   ├── application-limit.middleware.js
│   │   │   │   └── duplicate-application.middleware.js
│   │   │   ├── pipelines/
│   │   │   │   ├── application-pipeline.js
│   │   │   │   └── stages/
│   │   │   │       ├── validate.stage.js
│   │   │   │       ├── check-duplicate.stage.js
│   │   │   │       ├── parse-resume.stage.js
│   │   │   │       ├── check-subscription.stage.js
│   │   │   │       └── save.stage.js
│   │   │   ├── subscribers/
│   │   │   │   ├── application-submitted.subscriber.js
│   │   │   │   ├── application-status-changed.subscriber.js
│   │   │   │   └── interview-scheduled.subscriber.js
│   │   │   ├── constants/
│   │   │   ├── tests/
│   │   │   └── index.js
│   │   │
│   │   ├── search/
│   │   │   ├── controllers/
│   │   │   │   ├── job-search.controller.js
│   │   │   │   ├── candidate-search.controller.js
│   │   │   │   └── advanced-search.controller.js
│   │   │   ├── services/
│   │   │   │   ├── job-search.service.js
│   │   │   │   ├── candidate-search.service.js
│   │   │   │   ├── elasticsearch.service.js
│   │   │   │   ├── search-indexing.service.js
│   │   │   │   ├── search-suggestion.service.js
│   │   │   │   └── search-history.service.js
│   │   │   ├── repositories/
│   │   │   │   └── search-history.repository.js
│   │   │   ├── builders/
│   │   │   │   ├── job-query.builder.js
│   │   │   │   └── candidate-query.builder.js
│   │   │   ├── validators/
│   │   │   ├── dto/
│   │   │   ├── transformers/
│   │   │   ├── routes/
│   │   │   │   └── search.routes.js
│   │   │   ├── models/
│   │   │   │   └── SearchHistory.model.js
│   │   │   ├── constants/
│   │   │   ├── tests/
│   │   │   └── index.js
│   │   │
│   │   ├── recommendations/
│   │   │   ├── controllers/
│   │   │   │   ├── job-recommendation.controller.js
│   │   │   │   └── candidate-recommendation.controller.js
│   │   │   ├── services/
│   │   │   │   ├── job-recommendation.service.js
│   │   │   │   ├── candidate-recommendation.service.js
│   │   │   │   └── ml-matching.service.js
│   │   │   ├── strategies/
│   │   │   │   ├── matching-strategy.interface.js
│   │   │   │   ├── skills-matching.strategy.js
│   │   │   │   ├── location-matching.strategy.js
│   │   │   │   ├── experience-matching.strategy.js
│   │   │   │   └── ml-matching.strategy.js
│   │   │   ├── algorithms/
│   │   │   │   ├── collaborative-filtering.js
│   │   │   │   ├── content-based-filtering.js
│   │   │   │   └── hybrid-recommendation.js
│   │   │   ├── routes/
│   │   │   │   └── recommendation.routes.js
│   │   │   ├── constants/
│   │   │   ├── tests/
│   │   │   └── index.js
│   │   │
│   │   ├── resumes/
│   │   │   ├── controllers/
│   │   │   │   ├── resume.controller.js
│   │   │   │   ├── resume-upload.controller.js
│   │   │   │   └── resume-builder.controller.js
│   │   │   ├── services/
│   │   │   │   ├── resume.service.js
│   │   │   │   ├── resume-upload.service.js
│   │   │   │   ├── resume-parser.service.js
│   │   │   │   ├── resume-builder.service.js
│   │   │   │   └── resume-template.service.js
│   │   │   ├── parsers/
│   │   │   │   ├── pdf-parser.js
│   │   │   │   ├── docx-parser.js
│   │   │   │   └── text-parser.js
│   │   │   ├── repositories/
│   │   │   │   └── resume.repository.js
│   │   │   ├── validators/
│   │   │   ├── dto/
│   │   │   ├── transformers/
│   │   │   ├── routes/
│   │   │   │   └── resume.routes.js
│   │   │   ├── models/
│   │   │   │   ├── Resume.model.js
│   │   │   │   └── ResumeTemplate.model.js
│   │   │   ├── templates/
│   │   │   │   ├── classic.template.js
│   │   │   │   ├── modern.template.js
│   │   │   │   └── professional.template.js
│   │   │   ├── constants/
│   │   │   ├── tests/
│   │   │   └── index.js
│   │   │
│   │   ├── notifications/
│   │   │   ├── controllers/
│   │   │   │   ├── notification.controller.js
│   │   │   │   └── notification-settings.controller.js
│   │   │   ├── services/
│   │   │   │   ├── notification.service.js
│   │   │   │   ├── email-notification.service.js
│   │   │   │   ├── sms-notification.service.js
│   │   │   │   ├── push-notification.service.js
│   │   │   │   └── in-app-notification.service.js
│   │   │   ├── repositories/
│   │   │   │   └── notification.repository.js
│   │   │   ├── factories/
│   │   │   │   └── notification.factory.js
│   │   │   ├── templates/
│   │   │   │   ├── email/
│   │   │   │   │   ├── job-alert.template.js
│   │   │   │   │   ├── application-status.template.js
│   │   │   │   │   ├── interview-invitation.template.js
│   │   │   │   │   └── welcome.template.js
│   │   │   │   └── sms/
│   │   │   │       └── sms-templates.js
│   │   │   ├── validators/
│   │   │   ├── dto/
│   │   │   ├── routes/
│   │   │   │   └── notification.routes.js
│   │   │   ├── models/
│   │   │   │   ├── Notification.model.js
│   │   │   │   └── NotificationSettings.model.js
│   │   │   ├── subscribers/
│   │   │   │   └── notification.subscribers.js
│   │   │   ├── constants/
│   │   │   ├── tests/
│   │   │   └── index.js
│   │   │
│   │   ├── messaging/
│   │   │   ├── controllers/
│   │   │   │   ├── message.controller.js
│   │   │   │   └── conversation.controller.js
│   │   │   ├── services/
│   │   │   │   ├── message.service.js
│   │   │   │   ├── conversation.service.js
│   │   │   │   └── message-attachment.service.js
│   │   │   ├── repositories/
│   │   │   │   ├── message.repository.js
│   │   │   │   └── conversation.repository.js
│   │   │   ├── validators/
│   │   │   ├── dto/
│   │   │   ├── transformers/
│   │   │   ├── routes/
│   │   │   │   └── messaging.routes.js
│   │   │   ├── models/
│   │   │   │   ├── Message.model.js
│   │   │   │   ├── Conversation.model.js
│   │   │   │   └── MessageAttachment.model.js
│   │   │   ├── socket/
│   │   │   │   ├── handlers/
│   │   │   │   │   ├── chat.handler.js
│   │   │   │   │   └── typing.handler.js
│   │   │   │   └── middleware/
│   │   │   ├── constants/
│   │   │   ├── tests/
│   │   │   └── index.js
│   │   │
│   │   ├── reviews/
│   │   │   ├── controllers/
│   │   │   │   ├── company-review.controller.js
│   │   │   │   ├── salary-review.controller.js
│   │   │   │   └── interview-review.controller.js
│   │   │   ├── services/
│   │   │   │   ├── review.service.js
│   │   │   │   ├── review-moderation.service.js
│   │   │   │   └── review-analytics.service.js
│   │   │   ├── repositories/
│   │   │   │   └── review.repository.js
│   │   │   ├── validators/
│   │   │   ├── dto/
│   │   │   ├── transformers/
│   │   │   ├── routes/
│   │   │   │   └── review.routes.js
│   │   │   ├── models/
│   │   │   │   ├── CompanyReview.model.js
│   │   │   │   ├── SalaryReview.model.js
│   │   │   │   ├── InterviewReview.model.js
│   │   │   │   └── ReviewVote.model.js
│   │   │   ├── constants/
│   │   │   ├── tests/
│   │   │   └── index.js
│   │   │
│   │   ├── payments/
│   │   │   ├── controllers/
│   │   │   │   ├── payment.controller.js
│   │   │   │   ├── invoice.controller.js
│   │   │   │   └── webhook.controller.js
│   │   │   ├── services/
│   │   │   │   ├── payment.service.js
│   │   │   │   ├── stripe.service.js
│   │   │   │   ├── razorpay.service.js
│   │   │   │   ├── invoice.service.js
│   │   │   │   └── refund.service.js
│   │   │   ├── repositories/
│   │   │   │   ├── payment.repository.js
│   │   │   │   └── invoice.repository.js
│   │   │   ├── validators/
│   │   │   ├── dto/
│   │   │   ├── transformers/
│   │   │   ├── routes/
│   │   │   │   ├── payment.routes.js
│   │   │   │   └── webhook.routes.js
│   │   │   ├── models/
│   │   │   │   ├── Payment.model.js
│   │   │   │   ├── Invoice.model.js
│   │   │   │   └── Refund.model.js
│   │   │   ├── webhooks/
│   │   │   │   ├── stripe.webhook.js
│   │   │   │   └── razorpay.webhook.js
│   │   │   ├── constants/
│   │   │   ├── tests/
│   │   │   └── index.js
│   │   │
│   │   ├── subscriptions/
│   │   │   ├── controllers/
│   │   │   │   ├── subscription.controller.js
│   │   │   │   └── plan.controller.js
│   │   │   ├── services/
│   │   │   │   ├── subscription.service.js
│   │   │   │   ├── plan.service.js
│   │   │   │   ├── billing-cycle.service.js
│   │   │   │   └── usage-tracking.service.js
│   │   │   ├── repositories/
│   │   │   │   ├── subscription.repository.js
│   │   │   │   └── plan.repository.js
│   │   │   ├── validators/
│   │   │   ├── dto/
│   │   │   ├── transformers/
│   │   │   ├── routes/
│   │   │   │   └── subscription.routes.js
│   │   │   ├── models/
│   │   │   │   ├── Subscription.model.js
│   │   │   │   ├── Plan.model.js
│   │   │   │   └── UsageRecord.model.js
│   │   │   ├── middleware/
│   │   │   │   ├── subscription-check.middleware.js
│   │   │   │   └── feature-access.middleware.js
│   │   │   ├── constants/
│   │   │   ├── tests/
│   │   │   └── index.js
│   │   │
│   │   ├── analytics/
│   │   │   ├── controllers/
│   │   │   │   ├── analytics.controller.js
│   │   │   │   ├── employer-analytics.controller.js
│   │   │   │   └── jobseeker-analytics.controller.js
│   │   │   ├── services/
│   │   │   │   ├── analytics.service.js
│   │   │   │   ├── job-analytics.service.js
│   │   │   │   ├── application-analytics.service.js
│   │   │   │   ├── user-analytics.service.js
│   │   │   │   └── platform-analytics.service.js
│   │   │   ├── repositories/
│   │   │   │   └── analytics.repository.js
│   │   │   ├── aggregators/
│   │   │   │   ├── job.aggregator.js
│   │   │   │   ├── application.aggregator.js
│   │   │   │   └── user.aggregator.js
│   │   │   ├── routes/
│   │   │   │   └── analytics.routes.js
│   │   │   ├── models/
│   │   │   │   ├── AnalyticsEvent.model.js
│   │   │   │   ├── JobViewAnalytics.model.js
│   │   │   │   └── ProfileViewAnalytics.model.js
│   │   │   ├── constants/
│   │   │   ├── tests/
│   │   │   └── index.js
│   │   │
│   │   ├── admin/
│   │   │   ├── controllers/
│   │   │   │   ├── admin.controller.js
│   │   │   │   ├── user-management.controller.js
│   │   │   │   ├── job-management.controller.js
│   │   │   │   ├── company-management.controller.js
│   │   │   │   ├── content-moderation.controller.js
│   │   │   │   └── system-settings.controller.js
│   │   │   ├── services/
│   │   │   │   ├── admin.service.js
│   │   │   │   ├── user-management.service.js
│   │   │   │   ├── moderation.service.js
│   │   │   │   ├── fraud-detection.service.js
│   │   │   │   └── system-health.service.js
│   │   │   ├── repositories/
│   │   │   │   └── admin.repository.js
│   │   │   ├── validators/
│   │   │   ├── dto/
│   │   │   ├── transformers/
│   │   │   ├── routes/
│   │   │   │   └── admin.routes.js
│   │   │   ├── models/
│   │   │   │   ├── Admin.model.js
│   │   │   │   ├── ModerationQueue.model.js
│   │   │   │   ├── AuditLog.model.js
│   │   │   │   └── SystemSettings.model.js
│   │   │   ├── middleware/
│   │   │   │   ├── admin-auth.middleware.js
│   │   │   │   └── admin-permission.middleware.js
│   │   │   ├── constants/
│   │   │   ├── tests/
│   │   │   └── index.js
│   │   │
│   │   ├── categories/
│   │   │   ├── controllers/
│   │   │   │   └── category.controller.js
│   │   │   ├── services/
│   │   │   │   └── category.service.js
│   │   │   ├── repositories/
│   │   │   │   └── category.repository.js
│   │   │   ├── routes/
│   │   │   │   └── category.routes.js
│   │   │   ├── models/
│   │   │   │   └── Category.model.js
│   │   │   ├── tests/
│   │   │   └── index.js
│   │   │
│   │   ├── industries/
│   │   │   ├── controllers/
│   │   │   │   └── industry.controller.js
│   │   │   ├── services/
│   │   │   │   └── industry.service.js
│   │   │   ├── repositories/
│   │   │   │   └── industry.repository.js
│   │   │   ├── routes/
│   │   │   │   └── industry.routes.js
│   │   │   ├── models/
│   │   │   │   └── Industry.model.js
│   │   │   ├── tests/
│   │   │   └── index.js
│   │   │
│   │   ├── locations/
│   │   │   ├── controllers/
│   │   │   │   └── location.controller.js
│   │   │   ├── services/
│   │   │   │   ├── location.service.js
│   │   │   │   └── geocoding.service.js
│   │   │   ├── repositories/
│   │   │   │   └── location.repository.js
│   │   │   ├── routes/
│   │   │   │   └── location.routes.js
│   │   │   ├── models/
│   │   │   │   └── Location.model.js
│   │   │   ├── tests/
│   │   │   └── index.js
│   │   │
│   │   └── skills/
│   │       ├── controllers/
│   │       │   └── skill.controller.js
│   │       ├── services/
│   │       │   ├── skill.service.js
│   │       │   └── skill-suggestion.service.js
│   │       ├── repositories/
│   │       │   └── skill.repository.js
│   │       ├── routes/
│   │       │   └── skill.routes.js
│   │       ├── models/
│   │       │   └── Skill.model.js
│   │       ├── tests/
│   │       └── index.js
│   │
│   ├── shared/
│   │   ├── middleware/
│   │   │   ├── error-handler.middleware.js
│   │   │   ├── not-found.middleware.js
│   │   │   ├── rate-limiter.middleware.js
│   │   │   ├── request-logger.middleware.js
│   │   │   ├── cors.middleware.js
│   │   │   ├── compression.middleware.js
│   │   │   ├── helmet.middleware.js
│   │   │   ├── pagination.middleware.js
│   │   │   ├── upload.middleware.js
│   │   │   ├── cache.middleware.js
│   │   │   └── validation.middleware.js
│   │   │
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   ├── catchAsync.js
│   │   │   ├── logger.js
│   │   │   ├── encryption.js
│   │   │   ├── helpers.js
│   │   │   ├── date.utils.js
│   │   │   ├── string.utils.js
│   │   │   ├── array.utils.js
│   │   │   ├── validators.js
│   │   │   ├── sanitizer.js
│   │   │   ├── pagination.js
│   │   │   └── file.utils.js
│   │   │
│   │   ├── config/
│   │   │   ├── index.js
│   │   │   ├── app.config.js
│   │   │   ├── database.config.js
│   │   │   ├── redis.config.js
│   │   │   ├── elasticsearch.config.js
│   │   │   ├── email.config.js
│   │   │   ├── sms.config.js
│   │   │   ├── storage.config.js
│   │   │   ├── payment.config.js
│   │   │   ├── jwt.config.js
│   │   │   ├── oauth.config.js
│   │   │   ├── logger.config.js
│   │   │   ├── cors.config.js
│   │   │   ├── rate-limit.config.js
│   │   │   ├── queue.config.js
│   │   │   └── features.config.js
│   │   │
│   │   ├── database/
│   │   │   ├── connection.js
│   │   │   ├── migrations/
│   │   │   │   ├── 20240101000000-create-users.js
│   │   │   │   ├── 20240101000001-create-companies.js
│   │   │   │   ├── 20240101000002-create-jobs.js
│   │   │   │   ├── 20240101000003-create-applications.js
│   │   │   │   ├── 20240101000004-create-indexes.js
│   │   │   │   └── ...
│   │   │   ├── seeders/
│   │   │   │   ├── 20240101000000-seed-categories.js
│   │   │   │   ├── 20240101000001-seed-industries.js
│   │   │   │   ├── 20240101000002-seed-locations.js
│   │   │   │   ├── 20240101000003-seed-skills.js
│   │   │   │   ├── 20240101000004-seed-admin-user.js
│   │   │   │   └── ...
│   │   │   ├── query-builder.js
│   │   │   └── transaction.js
│   │   │
│   │   ├── services/
│   │   │   ├── storage/
│   │   │   │   ├── storage.service.js
│   │   │   │   ├── local-storage.service.js
│   │   │   │   └── s3-storage.service.js
│   │   │   ├── cache/
│   │   │   │   ├── cache.service.js
│   │   │   │   ├── redis-cache.service.js
│   │   │   │   └── memory-cache.service.js
│   │   │   ├── queue/
│   │   │   │   ├── queue.service.js
│   │   │   │   └── bull-queue.service.js
│   │   │   └── email/
│   │   │       ├── email.service.js
│   │   │       └── email-provider.service.js
│   │   │
│   │   ├── constants/
│   │   │   ├── http-status.constants.js
│   │   │   ├── error-codes.constants.js
│   │   │   ├── user-roles.constants.js
│   │   │   ├── job-status.constants.js
│   │   │   ├── application-status.constants.js
│   │   │   └── event-types.constants.js
│   │   │
│   │   ├── events/
│   │   │   ├── event-emitter.js
│   │   │   ├── event-bus.js
│   │   │   └── event-handlers/
│   │   │       ├── user-events.handler.js
│   │   │       ├── job-events.handler.js
│   │   │       └── application-events.handler.js
│   │   │
│   │   ├── validators/
│   │   │   ├── common.validator.js
│   │   │   ├── email.validator.js
│   │   │   ├── phone.validator.js
│   │   │   └── file.validator.js
│   │   │
│   │   ├── types/
│   │   │   ├── index.d.ts
│   │   │   ├── user.types.js
│   │   │   ├── job.types.js
│   │   │   └── application.types.js
│   │   │
│   │   └── interfaces/
│   │       ├── repository.interface.js
│   │       ├── service.interface.js
│   │       └── transformer.interface.js
│   │
│   ├── jobs/
│   │   ├── index.js
│   │   ├── email.job.js
│   │   ├── sms.job.js
│   │   ├── notification.job.js
│   │   ├── job-alert.job.js
│   │   ├── expired-job.job.js
│   │   ├── subscription-renewal.job.js
│   │   ├── analytics-aggregation.job.js
│   │   ├── search-indexing.job.js
│   │   ├── recommendation-update.job.js
│   │   ├── data-cleanup.job.js
│   │   └── backup.job.js
│   │
│   ├── workers/
│   │   ├── index.js
│   │   ├── email.worker.js
│   │   ├── notification.worker.js
│   │   ├── resume-parser.worker.js
│   │   ├── search-indexer.worker.js
│   │   └── image-processor.worker.js
│   │
│   ├── socket/
│   │   ├── index.js
│   │   ├── server.js
│   │   ├── handlers/
│   │   │   ├── connection.handler.js
│   │   │   ├── chat.handler.js
│   │   │   ├── notification.handler.js
│   │   │   └── typing.handler.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── error.middleware.js
│   │   └── events/
│   │       ├── chat.events.js
│   │       └── notification.events.js
│   │
│   ├── api/
│   │   ├── v1/
│   │   │   ├── routes/
│   │   │   │   ├── index.js
│   │   │   │   ├── auth.routes.js
│   │   │   │   ├── user.routes.js
│   │   │   │   ├── jobseeker.routes.js
│   │   │   │   ├── employer.routes.js
│   │   │   │   ├── company.routes.js
│   │   │   │   ├── job.routes.js
│   │   │   │   ├── application.routes.js
│   │   │   │   ├── search.routes.js
│   │   │   │   ├── recommendation.routes.js
│   │   │   │   ├── resume.routes.js
│   │   │   │   ├── notification.routes.js
│   │   │   │   ├── messaging.routes.js
│   │   │   │   ├── review.routes.js
│   │   │   │   ├── payment.routes.js
│   │   │   │   ├── subscription.routes.js
│   │   │   │   ├── analytics.routes.js
│   │   │   │   ├── admin.routes.js
│   │   │   │   ├── category.routes.js
│   │   │   │   ├── industry.routes.js
│   │   │   │   ├── location.routes.js
│   │   │   │   ├── skill.routes.js
│   │   │   │   ├── webhook.routes.js
│   │   │   │   └── health.routes.js
│   │   │   └── index.js
│   │   │
│   │   └── v2/
│   │       └── (future versions)
│   │
│   ├── docs/
│   │   ├── swagger/
│   │   │   ├── index.js
│   │   │   ├── swagger.config.js
│   │   │   └── definitions/
│   │   │       ├── auth.swagger.js
│   │   │       ├── jobs.swagger.js
│   │   │       ├── applications.swagger.js
│   │   │       └── ...
│   │   ├── api-docs.yaml
│   │   ├── postman/
│   │   │   ├── collection.json
│   │   │   └── environment.json
│   │   └── architecture/
│   │       ├── system-design.md
│   │       ├── database-schema.md
│   │       └── api-documentation.md
│   │
│   ├── scripts/
│   │   ├── seed.js
│   │   ├── migrate.js
│   │   ├── rollback.js
│   │   ├── index-elasticsearch.js
│   │   ├── clear-cache.js
│   │   ├── cleanup-data.js
│   │   ├── backup-database.js
│   │   ├── generate-sitemap.js
│   │   ├── create-admin.js
│   │   └── health-check.js
│   │
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── validators/
│   │   │   ├── utils/
│   │   │   └── middleware/
│   │   │
│   │   ├── integration/
│   │   │   ├── auth/
│   │   │   ├── jobs/
│   │   │   ├── applications/
│   │   │   ├── search/
│   │   │   └── payments/
│   │   │
│   │   ├── e2e/
│   │   │   ├── user-journey/
│   │   │   ├── employer-journey/
│   │   │   └── admin-journey/
│   │   │
│   │   ├── fixtures/
│   │   │   ├── users.fixture.js
│   │   │   ├── jobs.fixture.js
│   │   │   ├── applications.fixture.js
│   │   │   └── companies.fixture.js
│   │   │
│   │   ├── helpers/
│   │   │   ├── test-setup.js
│   │   │   ├── test-teardown.js
│   │   │   └── mock-data.js
│   │   │
│   │   └── setup.js
│   │
│   ├── di/
│   │   ├── container.js
│   │   ├── bindings.js
│   │   └── providers/
│   │       ├── service.provider.js
│   │       ├── repository.provider.js
│   │       └── controller.provider.js
│   │
│   ├── app.js
│   └── server.js
│
├── public/
│   ├── uploads/
│   │   ├── resumes/
│   │   ├── avatars/
│   │   ├── company-logos/
│   │   ├── company-media/
│   │   ├── documents/
│   │   └── temp/
│   │
│   └── templates/
│       ├── email/
│       │   ├── layouts/
│       │   └── partials/
│       ├── pdf/
│       │   └── invoice-template.html
│       └── resume/
│           ├── classic.html
│           └── modern.html
│
├── logs/
│   ├── access.log
│   ├── error.log
│   ├── combined.log
│   ├── exceptions.log
│   └── rejections.log
│
├── storage/
│   ├── cache/
│   ├── sessions/
│   └── temp/
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── cd.yml
│   │   └── tests.yml
│   └── ISSUE_TEMPLATE/
│
├── node_modules/
│
├── .env
├── .env.example
├── .env.development
├── .env.staging
├── .env.production
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── .editorconfig
├── package.json
├── package-lock.json
├── nodemon.json
├── jest.config.js
├── docker-compose.yml
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── Dockerfile
├── Dockerfile.dev
├── .dockerignore
├── nginx.conf
├── ecosystem.config.js (PM2)
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── LICENSE