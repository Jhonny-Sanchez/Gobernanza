// Firebase Architecture Blueprint for AIGobernanza 360
// Supports Firebase Authentication & Firestore multi-tenant isolation by organizationId

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: typeof process !== 'undefined' ? process.env.VITE_FIREBASE_API_KEY : undefined,
  authDomain: typeof process !== 'undefined' ? process.env.VITE_FIREBASE_AUTH_DOMAIN : undefined,
  projectId: typeof process !== 'undefined' ? process.env.VITE_FIREBASE_PROJECT_ID : 'aigobernanza-360',
  storageBucket: typeof process !== 'undefined' ? process.env.VITE_FIREBASE_STORAGE_BUCKET : undefined,
  messagingSenderId: typeof process !== 'undefined' ? process.env.VITE_FIREBASE_MESSAGING_SENDER_ID : undefined,
  appId: typeof process !== 'undefined' ? process.env.VITE_FIREBASE_APP_ID : undefined,
};

/**
 * Firestore Collection References Schema:
 * 
 * /organizations/{orgId}
 * /organizations/{orgId}/memberships/{userId} -> { role: 'admin' | 'auditor' | 'editor' | 'viewer' }
 * /organizations/{orgId}/processes/{processId}
 * /organizations/{orgId}/aiSystems/{aiSystemId}
 * /organizations/{orgId}/risks/{riskId}
 * /organizations/{orgId}/requirementAssessments/{reqId}
 * /organizations/{orgId}/controlAssessments/{ctrlId}
 * /organizations/{orgId}/evidences/{evidenceId}
 * /organizations/{orgId}/documents/{docId}
 * /organizations/{orgId}/audits/{auditId}
 * /organizations/{orgId}/findings/{findingId}
 * /organizations/{orgId}/capas/{capaId}
 * /organizations/{orgId}/alerts/{alertId}
 * /organizations/{orgId}/activityLogs/{logId}
 * /organizations/{orgId}/objectives/{objId}
 * /organizations/{orgId}/stakeholders/{stkId}
 * /organizations/{orgId}/governanceRoles/{roleId}
 */

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);
