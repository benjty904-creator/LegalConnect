// Automated end-to-end test suite for LegalConnect frontend storage & business logic
import {
  registerCitizen,
  registerLawyer,
  createInitialAdmin,
  loginUser,
  logoutUser,
  getActiveUser,
  getAllUsers,
  updateUserProfile,
  updateLawyerStatus,
  hasAdminAccount,
} from "./src/services/authService.ts";

import {
  createServiceRequest,
  getAllRequests,
  getRequestsByUser,
  getRequestsForLawyer,
  updateRequestStatus,
  assignLawyerToRequest,
} from "./src/services/caseService.ts";

import {
  createAnonymousReport,
  getAllReports,
  updateReportStatus,
} from "./src/services/reportService.ts";

// In-memory localStorage mock for node test runner
const memoryStorage = new Map();
globalThis.localStorage = {
  getItem: (key) => memoryStorage.get(key) || null,
  setItem: (key, val) => memoryStorage.set(key, String(val)),
  removeItem: (key) => memoryStorage.delete(key),
  clear: () => memoryStorage.clear(),
};

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
}

async function runTests() {
  console.log("==================================================");
  console.log("RUNNING LEGALCONNECT AUTOMATED TEST SUITE");
  console.log("==================================================\n");

  // TEST 1: USER REGISTRATION
  console.log("TEST 1: USER REGISTRATION");
  const regRes = await registerCitizen({
    fullName: "Adaora Nwosu",
    email: "adaora@example.com",
    phone: "+234 801 111 2222",
    location: "Enugu",
    password: "Password123!",
  });
  assert(regRes.success === true, "Citizen registration succeeds");
  assert(regRes.user && regRes.user.id, "User has unique generated ID");
  assert(regRes.user.passwordSalt && regRes.user.passwordHash, "Password stored with salt and hash");
  assert(regRes.user.passwordHash !== "Password123!", "Password is NOT stored in plaintext");
  assert(getActiveUser()?.email === "adaora@example.com", "Active session set for registered user");

  // Duplicate email prevention
  const dupRes = await registerCitizen({
    fullName: "Adaora Clone",
    email: "adaora@example.com",
    phone: "+234 800 000 0000",
    password: "Password123!",
  });
  assert(dupRes.success === false, "Duplicate email registration is blocked");
  console.log("Test 1 Passed.\n");

  // TEST 2: LOGIN & AUTHENTICATION
  console.log("TEST 2: LOGIN & CREDENTIAL VERIFICATION");
  logoutUser();
  assert(getActiveUser() === null, "Logout clears active session");

  // Incorrect password
  const badPass = await loginUser("adaora@example.com", "WrongPassword!", "citizen");
  assert(badPass.success === false, "Login with wrong password fails");

  // Non-existent email
  const badEmail = await loginUser("nonexistent@example.com", "Password123!", "citizen");
  assert(badEmail.success === false, "Login with non-existent email fails");

  // Successful login
  const goodLogin = await loginUser("adaora@example.com", "Password123!", "citizen");
  assert(goodLogin.success === true, "Login with valid credentials succeeds");
  assert(getActiveUser()?.fullName === "Adaora Nwosu", "Active user set upon login");
  console.log("Test 2 Passed.\n");

  // TEST 3: SERVICE REQUEST SUBMISSION
  console.log("TEST 3: SERVICE REQUEST CREATION & PERSISTENCE");
  const currentUser = getActiveUser();
  const reqRes = createServiceRequest(
    {
      serviceType: "Free Pro-Bono",
      fullName: currentUser.fullName,
      email: currentUser.email,
      phone: currentUser.phone,
      location: currentUser.location,
      category: "Fundamental Human Rights & Unlawful Detention",
      urgency: "High",
      details: "Client was unlawfully detained without charge for 72 hours.",
      documentNames: ["bail_application.pdf", "summons_affidavit.pdf"],
    },
    currentUser
  );
  assert(reqRes.success === true, "Legal service request created successfully");
  assert(reqRes.request && reqRes.request.id, "Request has unique ID");
  assert(reqRes.request.referenceCode.startsWith("LC-"), "Request has human-readable reference code LC-YYYY-XXXX");
  assert(reqRes.request.userId === currentUser.id, "Request associated with active user ID");
  assert(reqRes.request.status === "Pending Assignment", "Initial status set to Pending Assignment");

  const storedRequests = getAllRequests();
  assert(storedRequests.length === 1, "Request persisted in localStorage");
  assert(storedRequests[0].referenceCode === reqRes.request.referenceCode, "Persisted request matches returned reference code");
  console.log("Test 3 Passed.\n");

  // TEST 4: INITIAL ADMIN SETUP & ADMINISTRATION
  console.log("TEST 4: INITIAL ADMIN SETUP & TRIAGE");
  assert(hasAdminAccount() === false, "Initially no administrator account exists");

  const adminSetupRes = await createInitialAdmin({
    fullName: "Chief Registrar Ibrahim",
    email: "superadmin@legalconnect.ng",
    phone: "+234 809 999 8888",
    password: "AdminSecurePass2026!",
  });
  assert(adminSetupRes.success === true, "Initial administrator account created");
  assert(hasAdminAccount() === true, "System records administrator existence");

  // Prevent duplicate admin setup
  const duplicateAdminRes = await createInitialAdmin({
    fullName: "Hacker Admin",
    email: "hacker@legalconnect.ng",
    password: "HackerPass123!",
  });
  assert(duplicateAdminRes.success === false, "Duplicate initial admin setup blocked");

  // Admin logs in
  const adminLogin = await loginUser("superadmin@legalconnect.ng", "AdminSecurePass2026!", "admin");
  assert(adminLogin.success === true, "Administrator login succeeds");

  // Admin views requests
  const adminRequests = getAllRequests();
  assert(adminRequests.length === 1, "Admin dashboard sees submitted citizen request");
  const targetReq = adminRequests[0];

  // Admin updates status
  const updateStatusRes = updateRequestStatus(targetReq.id, "Under Review");
  assert(updateStatusRes.success === true, "Admin updates status to Under Review");
  assert(getAllRequests()[0].status === "Under Review", "Status update persisted in storage");
  console.log("Test 4 Passed.\n");

  // TEST 5: USER REQUEST TRACKING
  console.log("TEST 5: USER REQUEST TRACKING");
  const adaoraReqs = getRequestsByUser(currentUser.id);
  assert(adaoraReqs.length === 1, "User dashboard fetches user's requests");
  assert(adaoraReqs[0].status === "Under Review", "User sees updated status from Admin triage");
  console.log("Test 5 Passed.\n");

  // TEST 6: ACCOUNT SEPARATION
  console.log("TEST 6: ACCOUNT SEPARATION");
  const userBRes = await registerCitizen({
    fullName: "Tunde Bakare",
    email: "tunde@example.com",
    phone: "+234 802 333 4444",
    location: "Lagos",
    password: "Password123!",
  });
  assert(userBRes.success === true, "Second user registered");
  const userB = userBRes.user;

  // User B submits a separate request
  const userBReq = createServiceRequest(
    {
      serviceType: "Paid Retainer",
      fullName: userB.fullName,
      email: userB.email,
      phone: userB.phone,
      location: userB.location,
      category: "Corporate & Commercial Law",
      urgency: "Medium",
      details: "CAC filing and company share capital increase.",
    },
    userB
  );
  assert(userBReq.success === true, "User B request created");

  // Verify separation
  const userAReqs = getRequestsByUser(currentUser.id);
  const userBReqs = getRequestsByUser(userB.id);
  assert(userAReqs.length === 1, "User A only sees 1 request (theirs)");
  assert(userAReqs[0].applicantName === "Adaora Nwosu", "User A request applicant matches User A");
  assert(userBReqs.length === 1, "User B only sees 1 request (theirs)");
  assert(userBReqs[0].applicantName === "Tunde Bakare", "User B request applicant matches User B");
  assert(getAllRequests().length === 2, "Admin sees total of 2 requests across all users");
  console.log("Test 6 Passed.\n");

  // TEST 7: LAWYER WORKFLOW
  console.log("TEST 7: LAWYER REGISTRATION, VERIFICATION & ASSIGNMENT");
  const lawyerRes = await registerLawyer({
    fullName: "Barr. Amina Bello",
    email: "amina.bello@law.ng",
    phone: "+234 803 555 7777",
    barNumber: "NBA/SCN/2014/08912",
    specialty: "Criminal Defense & Human Rights",
    state: "Abuja",
    password: "LawyerPass2026!",
  });
  assert(lawyerRes.success === true, "Lawyer registration succeeds");
  assert(lawyerRes.user.role === "lawyer", "Account role is lawyer");
  assert(lawyerRes.user.verificationStatus === "Pending Verification", "Initial status is Pending Verification");

  // Admin approves lawyer credentials
  const approveRes = updateLawyerStatus(lawyerRes.user.id, "Approved");
  assert(approveRes.success === true, "Admin approves lawyer bar credentials");

  // Admin assigns User A's case to Barr. Amina
  const assignRes = assignLawyerToRequest(targetReq.id, lawyerRes.user.id, "Barr. Amina Bello");
  assert(assignRes.success === true, "Case assigned to lawyer");
  assert(assignRes.request.status === "Assigned", "Status transitioned to Assigned");
  assert(assignRes.request.assignedLawyerName === "Barr. Amina Bello", "Assigned lawyer name recorded");

  // Lawyer logs in and checks cases
  const lawyerLogin = await loginUser("amina.bello@law.ng", "LawyerPass2026!", "lawyer");
  assert(lawyerLogin.success === true, "Lawyer logs in successfully");

  const lawyerCases = getRequestsForLawyer(lawyerRes.user.id, "Barr. Amina Bello");
  assert(lawyerCases.length === 1, "Lawyer dashboard displays assigned matter");

  // Lawyer accepts case -> In Progress -> In Court -> Completed
  updateRequestStatus(targetReq.id, "In Progress");
  assert(getRequestsForLawyer(lawyerRes.user.id)[0].status === "In Progress", "Lawyer accepts case -> In Progress");

  updateRequestStatus(targetReq.id, "In Court");
  assert(getRequestsForLawyer(lawyerRes.user.id)[0].status === "In Court", "Lawyer updates status to In Court");

  updateRequestStatus(targetReq.id, "Completed");
  assert(getRequestsForLawyer(lawyerRes.user.id)[0].status === "Completed", "Lawyer marks case Completed");

  // Confirm updated status in user dashboard
  assert(getRequestsByUser(currentUser.id)[0].status === "Completed", "Citizen dashboard immediately reflects Completed status");
  console.log("Test 7 Passed.\n");

  // TEST 8: ANONYMOUS WHISTLEBLOWER REPORTING
  console.log("TEST 8: ANONYMOUS WHISTLEBLOWER REPORTING");
  const reportRes = createAnonymousReport({
    category: "Corruption & Bribery",
    location: "Port Harcourt",
    description: "Extortion at municipal procurement department.",
    involvedParties: "Director of Procurement",
  });
  assert(reportRes.success === true, "Anonymous report submitted");
  assert(reportRes.report.trackingCode.startsWith("ANON-"), "Tracking code generated ANON-XXXXXX");
  assert(reportRes.report.status === "Unreviewed", "Report initial status is Unreviewed");

  const allReports = getAllReports();
  assert(allReports.length === 1, "Admin whistleblower repository has 1 report");

  // Admin updates report
  updateReportStatus(reportRes.report.id, "Investigating");
  assert(getAllReports()[0].status === "Investigating", "Admin marks report Investigating");
  console.log("Test 8 Passed.\n");

  // TEST 9: PROFILE UPDATE & PERSISTENCE
  console.log("TEST 9: PROFILE UPDATE & PERSISTENCE");
  const updateRes = updateUserProfile(currentUser.id, {
    phone: "+234 809 111 9999",
    location: "Abuja",
  });
  assert(updateRes.success === true, "User profile updated");
  assert(getAllUsers().find((u) => u.id === currentUser.id).phone === "+234 809 111 9999", "Updated phone persisted");
  assert(getAllUsers().find((u) => u.id === currentUser.id).location === "Abuja", "Updated location persisted");
  console.log("Test 9 Passed.\n");

  console.log("==================================================");
  console.log("ALL 9 TEST SUITES COMPLETED WITH 100% SUCCESS!");
  console.log("==================================================");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});

