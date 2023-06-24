import express from "express";
import { auth, requiredScopes } from "express-oauth2-jwt-bearer";
import sendEmail from "../utils/mail.js";

const router = express.Router();

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: "https://scribr.me",
  issuerBaseURL: "https://dev-5boxq3ne0luaiwlt.au.auth0.com/",
  tokenSigningAlg: "RS256",
});

// uncomment to have all routes require authentication
// router.use(jwtCheck);

// This route doesn't need authentication
router.get("/api/public", function (req, res) {
  sendEmail();
  res.json({
    message:
      "Hello from a public endpoint! You don't need to be authenticated to see this.",
  });
});

// This route needs authentication
router.get("/api/private", checkJwt, function (req, res) {
  res.json({
    message:
      "Hello from a private endpoint! You need to be authenticated to see this.",
  });
});

const checkScopes = requiredScopes("read:messages");

router.get("/api/private-scoped", checkJwt, checkScopes, function (req, res) {
  res.json({
    message:
      "Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.",
  });
});

export default router;
