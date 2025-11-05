const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    status: {
      type: String,
      enum: ['trial', 'active', 'paused', 'cancelled', 'expired', 'payment-failed'],
      default: 'trial',
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    trialEndsAt: Date,
    nextBillingDate: Date,
    lastBillingDate: Date,
    cancelledAt: Date,
    cancelReason: String,
    autoRenew: {
      type: Boolean,
      default: true,
    },
    paymentMethod: {
      type: String,
      enum: ['credit-card', 'debit-card', 'paypal', 'stripe', 'razorpay'],
    },
    paymentGateway: {
      type: String,
      enum: ['stripe', 'razorpay', 'paypal'],
    },
    gatewaySubscriptionId: String,
    usage: {
      jobPostings: {
        type: Number,
        default: 0,
      },
      featuredJobs: {
        type: Number,
        default: 0,
      },
      applications: {
        type: Number,
        default: 0,
      },
      resumeDownloads: {
        type: Number,
        default: 0,
      },
      candidateSearches: {
        type: Number,
        default: 0,
      },
    },
    discount: {
      code: String,
      percentage: Number,
      amount: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ plan: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ endDate: 1 });
subscriptionSchema.index({ nextBillingDate: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
