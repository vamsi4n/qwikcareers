const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Admin user is required'],
      index: true,
    },
    action: {
      type: String,
      enum: {
        values: ['create', 'update', 'delete', 'suspend', 'activate', 'approve', 'reject'],
        message: '{VALUE} is not a valid action type',
      },
      required: [true, 'Action is required'],
      index: true,
    },
    targetType: {
      type: String,
      enum: {
        values: ['user', 'job', 'company', 'review', 'application', 'system'],
        message: '{VALUE} is not a valid target type',
      },
      required: [true, 'Target type is required'],
      index: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Target ID is required'],
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      trim: true,
      match: [
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
        'Please provide a valid IP address',
      ],
    },
    userAgent: {
      type: String,
      trim: true,
      maxlength: [500, 'User agent cannot exceed 500 characters'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: false, // Using custom timestamp field
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for common queries
auditLogSchema.index({ admin: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ targetType: 1, targetId: 1 });
auditLogSchema.index({ targetType: 1, action: 1, timestamp: -1 });

// Instance method to format output
auditLogSchema.methods.toJSON = function () {
  const obj = this.toObject();

  // Remove sensitive fields if needed
  delete obj.__v;
  delete obj._id;

  // Format the response
  return {
    id: this._id,
    admin: obj.admin,
    action: obj.action,
    targetType: obj.targetType,
    targetId: obj.targetId,
    details: obj.details,
    ipAddress: obj.ipAddress,
    userAgent: obj.userAgent,
    timestamp: obj.timestamp,
    metadata: obj.metadata,
  };
};

module.exports = mongoose.model('AuditLog', auditLogSchema);
